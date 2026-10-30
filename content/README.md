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
3. **Hand-checked.** A YAML file in `calendar/`, for dates published once (state law, one-off notices). The card says "Checked by hand on <date>." Re-check when it goes stale.

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
