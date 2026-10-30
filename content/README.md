# Content data

Structured data the site is built from. One file per entry, YAML, so humans and Claude can both edit it and changes show up clearly in PRs.

**Draft schema (v0).** Expect it to change once the first topic area is built.

## `orgs/<slug>.yaml`: organizations

```yaml
name: Example Organization
slug: example-organization
kind: nonprofit        # nonprofit | government | community-group | business | school | faith
website: https://example.org
phone: "304-555-0100"   # optional; public main number only, as the source gives it
summary: One or two plain-language sentences on what they do.
topics: [poverty, food]
area: monongalia-county # or morgantown, statewide, national (a national line or program)
sources:
  - url: https://example.org/about
    checked: 2026-10-27
```

## `resources/<slug>.yaml`: things a person can use or do

```yaml
title: Free tax preparation
slug: free-tax-prep-example
org: example-organization  # slug from orgs/
topics: [poverty, money]
who_it_is_for: Households earning under a set amount.
hours: Monday to Friday, 9 a.m. to 5 p.m.  # optional; hours in words, as the source gives them (#139)
what_to_do: Call to book an appointment, January through April.
contact:
  phone: "304-555-0100"     # public organizational contact only
  text: "898-211"           # optional; a public text line, if the source gives one
  url: https://example.org/tax
  url_label: Book online  # optional; a short button label that says what the link is for (#335). Default "Website"
  place: 200 Main St, Morgantown, WV  # optional; adds a Directions button on door steps. Only a place the source publishes
cost: free
sources:
  - url: https://example.org/tax
    checked: 2026-10-27
```

## `calendar/<slug>.yaml`: dates and deadlines

Shown on the site's Deadlines page and in the subscribable `calendar.ics` feed. Entries drop off the site automatically once `ends` has passed (the site rebuilds every morning).

```yaml
title: Heating bill help (LIEAP) applications open
slug: lieap-2026-27           # unique; include the season or year
starts: 2026-11-02            # YYYY-MM-DD
ends: 2026-11-20              # YYYY-MM-DD; leave out for a single day
start_time: "08:00"           # optional, 24-hour HH:MM Eastern, quoted. Only when the source states it.
end_time: "12:00"             # optional, needs start_time and a single-day entry
org_name: WV Department of Human Services
who_it_is_for: Households that need help paying winter heating bills.
what_to_do: Apply at your local DoHS office or online before the window closes.
url: https://example.wv.gov/lieap   # where a person should go to act
topics: [money, housing]      # money, food, housing, health, family, government, voting, recycling, taxes, community
place: 200 M-Tec Dr, Morgantown, WV   # optional; adds a Directions button. Only a place the source publishes
phone: 304-555-0100           # optional; adds a Call button. Only a public office or program number the source publishes
phone_label: the City Clerk   # optional; who answers, read by screen readers. Defaults to org_name
venue: smithtown              # optional; slug from places/, so the event shows on that place's page (#455)
sources:
  - url: https://example.wv.gov/lieap
    checked: 2026-10-28
```

To roll a yearly item forward, copy the file, change the slug, dates, and sources, and re-check the source. Never guess a date: if the new date is not published yet, leave the item out and note it in an issue.

Run `npm run check-content` in `site/` to validate entries.

### Where calendar dates come from: three tiers

Best first. Use the highest tier a source supports.

1. **Live feed.** The source publishes an iCal, RSS, or JSON feed. The site fetches it every time it builds (every morning) and turns each item into a calendar entry. The card says "Pulled from <feed> on <date>." Code: `site/src/lib/feeds/`.
2. **Watched page.** The source has a web page with dates but no feed. A scheduled agent run reads the page and opens a PR with YAML entries when the dates change. Each entry lists that page as its source. (Not built yet.)
3. **Hand-checked.** A YAML file in `calendar/`, for dates published once (state law, one-off notices). The card says "Checked against the source on <date>." Don't say "by hand" or "by a person" unless a person did the check. Re-check when it goes stale.

If a hand-checked entry and a feed entry have the same `slug`, the hand-checked one wins. Use this to correct or add detail to a feed item.

Live feeds wired in now:

| Feed | What we keep | Feed URL |
|---|---|---|
| City of Morgantown calendar | Everything on the Main Calendar (mostly public meetings, plus city events like Trick-or-Treat) | `https://www.morgantownwv.gov/common/modules/iCalendar/iCalendar.aspx?catID=14&feed=calendar` |
| Mountaineer Food Bank pantry calendar | Mobile pantries the food bank files under Monongalia County | `https://mountaineerfoodbank.org/wp-json/tribe/events/v1/events?categories=monongalia-county` |
| Monongalia County calendar | Parks and recreation events and election days. Repeating events (like the weekly Commission meeting) are left out because we do not expand repeat rules, and we never guess a date | The JSON behind `https://www.monongaliacounty.gov/calendar.php` |

Feed entries only say what the feed says. When a feed does not say who an item is for or what to do, the entry says where it was listed and "See the event page for details."

### If a feed is down

The build never fails because of a feed. It logs a warning and uses the last good copy saved in `site/src/lib/feeds/snapshots/<id>.json`. If there is no saved copy, that feed is skipped. Refresh the saved copies with `npm run update-feeds` in `site/` and commit the changed files. `npm run check-content` also checks the saved copies.

### Adding a feed adapter

1. Find the feed and fetch it yourself first. Do not add a feed you could not fetch.
2. Add `site/src/lib/feeds/adapters/<id>.mjs`. Export an object with:
   - `id`: short name, also the snapshot file name
   - `name`: shown on cards, like "City of Morgantown calendar"
   - `org_name`: who publishes the feed
   - `page_url`: the human page people can check
   - `feed_url` (or `feedUrl(today)` if the URL needs the date)
   - `format`: `'text'` (iCal, RSS) or `'json'`
   - `parse(raw)`: returns entries with `title`, `slug`, `starts`, `ends`, `org_name`, `who_it_is_for`, `what_to_do`, `url`, `topics`. The loader adds `sources` and the fetched time.
3. For iCal, use `parseIcs` and `readIcsDate` from `site/src/lib/feeds/ical.mjs`. Clean text with `plain()` from `util.mjs` (it strips HTML and em dashes).
4. Start each slug with a prefix for the source and end it with the date, so slugs stay unique and stable.
5. Add the adapter to `ADAPTERS` in `site/src/lib/feeds/index.mjs`, run `npm run update-feeds`, `npm run check-content`, and `npm run build`, and commit the new snapshot.
6. Add a row to the table above.

## `corrections/<date>-<short-name>.yaml`: fixes we made

Every fix to a fact, link or out-of-date detail gets one file, shown on the public Corrections page (`/corrections/`, #158). Typos are fixed without one.

```yaml
date: 2026-10-30            # Morgantown date the fix went live
item: County recycling drop-off center
page: /recycling/           # optional; where the item shows
kind: outdated              # fact | link | outdated | wording
found_by: our-check         # our-check | works-there | helper | used-it | other
what: What was wrong and what it says now, in one or two plain sentences.
link: https://github.com/david-shortman/mon-county-community-hub/pull/355
```

`found_by` comes from the report form's optional question. Never name the person or group who reported it, unless the group asks for credit, and that goes to David first.

## `places/<slug>.yaml`: gathering places

Buildings people gather in: community centers, senior centers, neighborhood houses, public rec buildings, and fire halls that publish a hall to rent (#455). They make the Community centers and halls section (#450), and the groups and third spaces directory (#263) uses the same record. The schema is `schemas/place.schema.json`; `npm run check-content` checks every file against it.

```yaml
name: Example Community Center
other_names: [Example Community Building]  # optional; list both when sources disagree
slug: example
kind: community-center      # community-center | senior-center | neighborhood-house | rec-center | park-building | fire-hall
area: south                 # south | west | north | east | morgantown (Morgantown and close in)
community: Example          # the community name people would type
run_by:
  kind: volunteer-association  # volunteer-association | county | city | nonprofit | fire-department | parks-board | park-foundation | library
  org: example-org          # optional; slug from orgs/
  text: A volunteer association. The county owns the building.
story: A 1939 school, run as a community center since 1983.  # one plain line
facilities:                 # only what the source says
  rooms:
    - name: Main hall
      seats: 72
  kitchen: true
  outdoor: [pavilion, playground]
  step_free: true           # only when published
regular:                    # weekly or monthly happenings, in words
  - Lunch Monday, Wednesday and Friday
membership:
  dues: $5 a family a year
rentals:
  - space: Main hall
    seats: 72
    kitchen: true
    price: $150             # as the source gives it; leave out if not published
    deposit: $50
    book: Call the center.  # public contact only, never a volunteer's own number
contact:
  phone: "304-555-0100"
  url: https://example.org
  facebook: https://www.facebook.com/example  # shown as a link; never read by robots
  place: 100 Main St, Example, WV  # only an address the place publishes; leave out if sources conflict
status: active              # active | no-recent-activity | closed | renovating
last_activity_seen: 2026-10-16  # newest sign of activity we read
tags: [family-friendly]     # family-friendly | free | come-alone | beginners | step-free
notes:                      # gaps residents should know
  - Sources give two addresses, so call first.
sources:
  - url: https://example.org/rentals
    checked: 2026-10-30
phone_confirmed: 2026-11-02 # optional; when a person confirmed by phone (#164)
```

- **No private people.** Leave out volunteers' names and personal numbers, even when a center lists one as the rental contact. Say "Call the center" or point to its page instead.
- **Stale rule.** A place marked `active` whose `last_activity_seen` is over 6 months old shows "No recent activity seen, call first" (#39). A place found only in county lists is `no-recent-activity` from the start.
- **Dated events** go in `calendar/` with `venue: <place slug>`, so they show on the place's page. Weekly regulars stay in `regular`.

## `doors.yaml`: the five doors

The site is organized into five doors named for what is going on in a person's life, plus three lanes that are not doors: Help now, Dates, and About this site (#248). `doors.yaml` lists them and maps every `topics` tag used in this folder to one door, with the label people see:

```yaml
doors:
  - slug: this-month
    name: Get through this month
    hint: Can't pay a bill, behind on rent, short on food, need cash fast
    topics:
      money: Bills and money
      food: Food
```

Each door also has an `icon` and `examples`: a few problems in residents' words, each with the page it links to. They become the door cards on the home page, and an example shows only once its page exists.

A new topic tag needs a home in exactly one door, or `npm run check-content` fails. Adding, renaming or removing a door changes the site's shape, so that is David's call. A topic that fits no door waits for that call.

### `doors/<slug>.yaml`: a door's own page

Once a door has its own page (set `page:` on the door in `doors.yaml`), its guided page is built from `doors/<slug>.yaml`. The first one is `doors/care.yaml` (Get care, `/care/`). It has:

- `lede`: one line under the title.
- `cant_wait`: the one thing that can't wait for this door's people, with the resource it calls. The Text button uses `sms` if set (988 texts at its own number), or the record's text line (211 texts at 898-211). `emergency: true` adds a Call 911 button.
- `steps`: each with `when` (`today`, `week` or `opens`), the `resource` it points to, and our short `text`. A step states no facts of its own: its phone, link, cost, source and checked date come from that resource.
- `situations`: what people pick, in their words (`label`), the `page` with more, and the `steps` it adds. A situation shows only once its page exists. Steps used by several picks show once.
- `also`: "Often goes with this" links to other doors.

Within each group, steps show in the order they are listed. The page puts picks in the web address (`/care/?pick=shots&pick=dentist`), and a link can pre-pick one, as the home page does with `/money/?pick=rent`, so nothing is stored and steps can be texted or bookmarked. With steps showing, a person can text the link to themselves or print. Without scripts it is a list of plain links. A door page can add its own sections between the dates and the page list (the Get through this month door keeps the old Money help sections there). The layout is `site/src/components/DoorPage.astro`, shared by every door.

### Tagging a site page

Every page in `site/src/pages/` says where it lives in its frontmatter:

```js
export const page = {
  door: 'this-month',   // a door or lane slug from doors.yaml
  topic: 'money',       // one of that door's topics (lanes need none)
  label: 'Money help',  // short name for lists
  summary: "Can't pay a bill, behind on rent, cash fast, free tax help",
};
```

A step inside another page's flow (like the food questions) uses `parent: '/help/food/'` and a `label` instead, and takes its door from the parent.

From these tags the build makes the Topics page (`/topics/`), each door's list of pages, the breadcrumb above each heading, and the door and topic filters in search. A new page shows up in all of them with no menu edit. A topic shows on a door only once a page for it exists. A missing or wrong tag stops the build with a message that says what to fix. The code is in `site/src/lib/pages.mjs`.

## Rules

- Only public organizational contact details. Never a private person's info.
- Every entry has at least one source with a `checked` date.
- Entries older than 6 months since `checked` get flagged for re-verification.
- Every outside link is checked daily by the source check (`docs/operations/README.md`). If a source should not be fetched by a robot (Facebook, a login page), add a rule to `source-rules.yaml`.

### Rules for every entry

These come from the [trust and AI playbook](../docs/playbook/trust-and-ai.md) and the [open data playbook](../docs/playbook/open-data.md). Follow them in every content PR (#114).

- **Every fact is on a source page you read in the same session.** Each phone number, hour, address, limit and date must appear on a page listed in the entry's `sources`, opened and read while you write or re-check the entry. Never fill a gap from memory or "common knowledge." If the source does not say it, leave the field out. Never list a URL you did not open. The PR says which source supports which field. ([Treat AI output as unchecked until sourced](../docs/playbook/trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced))
- **Quote eligibility, dates and costs closely.** For `who_it_is_for`, dates and `cost`, keep the source's words and numbers as closely as plain language allows. If a simpler version would change the meaning, keep the source's words and add "See the full rules at the link." Never compute a limit the source does not state (for example, a percent of the poverty line turned into dollars), and never guess a date. ([Quote eligibility, dates, and costs from the source](../docs/playbook/trust-and-ai.md#quote-eligibility-dates-and-costs-from-the-source))
- **Deadlines say the last day counts (#51).** Write "The last day is Tuesday, December 15," with the weekday, not "by December 15" or "on or before." Give a time only when the source sets one. Times read "8 a.m.", "8:30 a.m.", "noon". Details: "Voice notes" in `docs/design/identity.md`.
- **Describe, never decide.** Say who a program is for in the source's terms. Never tell a reader they qualify or do not qualify; the program decides.
- **When sources differ, say who says what.** Name each source and what it says, with no verdict between them. ([decision](../docs/decisions/2026-10-29-1300-when-sources-differ.md))
- **Use our own topic labels.** Use the `topics` tags in `doors.yaml`. Never copy 211 taxonomy codes, terms or definitions; they are copyrighted. ([Use open topic labels](../docs/playbook/open-data.md#use-open-topic-labels-not-the-211-taxonomy))
- **`checked` is a Morgantown date.** Write `checked` as the date in Morgantown (America/New_York) when you read the source, not the UTC date. Only change `checked` after you actually re-read the source; moving facts between files or rewording them does not count.
- **Name the source as it is.** A source page is credited to an organization on the site only when it is on that organization's own website. A news article or a directory is shown by its address, and a page that names it says what it is (for example "a Morgantown Magazine article from January 14, 2026").

### What `npm run check-content` checks in orgs and resources

The build fails on any of these, because pages make call, text and map links straight from these files (#259):

- **Required fields.** Orgs: `name`, `slug`, `kind`, `summary`, `topics`, `area`, `sources`. Resources: `title`, `slug`, `org`, `topics`, `who_it_is_for`, `what_to_do`, `contact` with a `url`, `sources`.
- **Slugs** are lowercase letters, numbers and dashes, match the file name, and are not used twice. A resource's `org` must have a file in `orgs/`.
- **`kind`** is one of `nonprofit`, `government`, `community-group`, `business`, `school`, `faith`.
- **`area`** is one of `morgantown`, `monongalia-county`, `statewide`, `national`.
- **Phones and text lines** (org `phone`, `contact.phone`, `contact.text`) are a short code (`211`, `988`), a text code (`898-211`), or a full number (`304-555-0100`, `1-877-716-1212`). Quote them so YAML keeps them as text.
- **`hours`** and **`cost`** are text. **`contact.place`** is an address with a comma, like `"200 M-Tec Dr, Morgantown, WV"`. **`contact.email`** looks like an email address.
- **Sources** have a web link and a `checked` date that is not in the future. No em dashes anywhere.

It also warns on time and deadline wording in hand-written text: times read "8 a.m.", "8:30 p.m." or "noon" (not "8 AM", "8:00 a.m." or "13:00"), and a deadline in `what_to_do` reads "The last day is Tuesday, December 15." rather than "by December 15" (#413).

It warns (but does not fail) on fields it does not know, which usually means a typo, and on sources last checked over 6 months ago. The Health check (`docs/operations/README.md`) lists the same past-due entries every 4 hours, so Duet can re-check them.
