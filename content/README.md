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
what_to_bring:          # optional (#159); what to have ready, close to the source's words
  - Photo ID
what_happens: What the first call or visit is like, in one or two sentences from the source.  # optional
best_time: Mornings are less busy.  # optional; only when the source says so
if_you_want_help: [wv-211]  # optional; resource slugs of people who can help you through it, each with its own source
sources:
  - url: https://example.org/tax
    checked: 2026-10-27
```

### Listing facts for a place to go (#177)

A resource with a `contact.place` is a place a person goes. People need these facts to decide whether to go ([`docs/design/presentation.md`](../docs/design/presentation.md), "What every listing needs"). All are optional, and each one comes only from the record's own sources. If the source does not say, leave it out.

```yaml
hours: Monday to Friday, 7 a.m. to 3:30 p.m.  # in words, always shown
opening_hours:          # the same hours, so a card can say "Open now" (#176)
  - days: [mon, tue, wed, thu, fri]   # mon tue wed thu fri sat sun
    opens: "07:00"      # quoted, 24-hour, Eastern time
    closes: "15:30"     # "24:00" for midnight; earlier than opens means it closes the next morning
# opening_hours: always   # open 24 hours, every day
closed_on: [thanksgiving, christmas]  # optional (#726); holidays the source names: new-years-day, memorial-day, independence-day, labor-day, thanksgiving, christmas
get_in: walk-in         # walk-in | appointment | call-first
languages: [Spanish]    # languages the source says staff speak or interpret
access: Step-free entrance on the Main Street side.  # only what the source says
meetings:               # optional (#902); regular meetings in the source's words
  - name: Evansdale Neighborhood Association
    when: First Wednesday of the month at 6:30 p.m. in Percival Hall.
steps:                  # optional (#822); what to do as a short numbered list
  - Make a free account on the site.
  - Upload your resume.
options:                # optional (#973); a short bulleted list of choices, like the IDs that count
  - A U.S. passport
notes:                  # optional (#973); short paragraphs after the lists, for exceptions
  - If you are 65 or older, an expired ID may still count.
```

`steps` works on any resource, not just places: keep `what_to_do` as a one-line summary and put the rest in `steps`, so a card shows a short numbered list instead of a long paragraph. `options` works the same way for a list of choices where order does not matter (a bulleted list), and `notes` holds exceptions as separate short paragraphs after the lists. `opening_hours` needs `hours` too, because the words always show and the badge only adds to them. Holidays and one-off closings are not in `opening_hours`, so a card with it still says "Call to confirm." `npm run check-content` checks these fields, and warns when a place to go has no `hours`, `cost` or `get_in` yet.

Set `private_trace: true` on a domestic or sexual violence listing, or any listing where a text or share left on someone's phone could put them at risk (#555). The card then leaves off the "Pass it on" row (Text, Print, Share). Calendar entries take the same flag. The page's quick exit is still the way out.

### Town and neighborhood (#395)

Dates (`calendar/`) and resources can name their town, and a neighborhood inside it, so a card can say "Westover" or "Sunnyside, Morgantown" and Dates can group by town.

```yaml
town: Morgantown         # one name from TOWNS in site/src/lib/towns.mjs
neighborhood: Sunnyside  # optional; needs a town
```

Set them only when the record's own source names the place. Never work a town out from a mailing address: many places with a "Morgantown, WV" address are outside the city, and Westover, Star City, Granville, Cheat Lake and Blacksville are their own places. A name not in the list fails `npm run check-content`; add it to the list when a source needs it.

## `calendar/<slug>.yaml`: dates and deadlines

Shown on the site's Dates and deadlines page and in the subscribable `calendar.ics` feed. Entries drop off the site automatically once `ends` has passed (the site rebuilds every morning).

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
topics: [money, housing]      # money, food, housing, health, family, government, voting, recycling, taxes, community, secondhand, market
place: 200 M-Tec Dr, Morgantown, WV   # optional; adds a Directions button. Only a place the source publishes
phone: 304-555-0100           # optional; adds a Call button. Only a public office or program number the source publishes
phone_label: the City Clerk   # optional; who answers, read by screen readers. Defaults to org_name
town: Westover               # optional; see "Town and neighborhood" below (#395)
venue: smithtown              # optional; slug from places/, so the event shows on that place's page (#455)
sources:
  - url: https://example.wv.gov/lieap
    checked: 2026-10-28
```

Home dates that fall on the same day every year (tax deadlines, fire seasons, upkeep tips) can go in `home-year.yaml` instead, as one rule each; the build shows each rule's next date and puts it in `home.ics` (#1051). The file's header lists the fields.

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
| Morgantown Public Library System calendar | One-time events and closures at every branch. Programs the feed repeats 3 or more times (weekly storytimes, clubs) are left out so they do not bury the dates page. Staff names in the feed are never read | `https://events.mympls.org/ical_subscribe.php?src=p&cid=17544` |
| Monongalia Arts Center calendar | Classes, workshops, concerts and markets. Cards send people to the center's site for cost. A repeating event shows only the date the feed gives | The public Google Calendar on `https://www.monartscenter.com/` |
| Morgantown Farmers Market calendar | Market days only, not the market's old social media reminders. A repeating market shows only its first date, with a note to check for later dates | The market's public Google Calendar (`morgantownfarmersmarket@gmail.com`) |
| Mylan Park events calendar | Every event the park lists, including outside groups' shows, meets and markets. Cards send people to the event page for tickets and cost | `https://mylanpark.org/wp-json/tribe/events/v1/events` |
| Friends of Deckers Creek events | Every event in the feed (mostly creek and trail cleanups, a few a year) | `https://deckerscreek.org/events.ics` |

Not wired in: WVU's events calendar (`www.events.wvu.edu`) answers our requests with 403 Forbidden (checked 2026-10-30), so it stays out until WVU publishes a feed we may read. We never work around a block (#107).

Feed entries only say what the feed says. A card's short summary is the first sentences of the feed's own description, when it has one that says more than the title (#230). Otherwise the card says where it was listed. Times come from the feed only when they look like real times; the city's end times are placeholders, so city cards show only the start.

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
5. The site finds every file in `adapters/` on its own (#71), so there is no list to edit. Run `npm run update-feeds`, `npm run check-content`, and `npm run build`, and commit the new snapshot.
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

### Groups and free places to sit (#263)

The Find your people page (`/find-your-people/`) uses the same record with two more kinds. The community centers pages leave both out.

- `kind: library`: a library branch, listed as a free place to sit. `regular` holds its open hours in words.
- `kind: group`: something people can join more than once, like a game night, a run club or a dance. It has no building of its own. Extra fields:

```yaml
regular: [Second Tuesday of each month, 6 p.m.]  # when it meets, as the source says
cost: Free                  # as the source says; leave out if not stated
venue: wiles-hill-community-center  # optional; the place it meets, if it is in places/
interests: [games, books]   # games | books | crafts | arts | music | dance | theater | outdoors | running | cycling | sports | food | languages | learning | growing | social | service | families | lgbtq | newcomers
tags: [come-alone, beginners, free, weekly]  # also weekly and growing
run_by:
  kind: community-group     # also business, university, community-group
```

- **Facebook-only groups:** name, the Facebook link and `status: no-recent-activity`, with no times or facts from Facebook (same rule as #459). Never quote members.
- Tags only when the source supports them: `come-alone` when it says newcomers are welcome or it is a drop-in program, `beginners` when it says no experience needed.

## `needs/<slug>.yaml`: the needs register

The ranked, sourced list of problems people in Mon County face (charter, "Finding real problems"; research in #44, format in #74). One file per need. The full shape, with every field explained, is the JSON Schema in [`schemas/need.schema.json`](schemas/need.schema.json).

```yaml
title: Paying winter heating bills      # the need in a few plain words
slug: paying-winter-heating-bills       # matches the file name
summary: One to three plain sentences on the problem. Describe it; take no policy side.
evidence:                               # at least one; every item has a source
  - url: https://example.org/report
    checked: 2026-10-30                 # Morgantown date you read it
    shows: What the source shows, in plain words.
    figure: "17% of households"         # optional; the number as the source states it
    data_date: "2023"                   # optional; the year or period it covers
    publisher: Example Org              # optional
affected:                               # aggregate only: a count or an estimate, with its source
  estimate: "about 1 in 6 households"   # or count: 1200 (a whole number the source states)
  description: Who is counted.
  url: https://example.org/report
  checked: 2026-10-30
severity: high                          # low | medium | high
severity_why: Why, in one line.         # optional
trend: unknown                          # better | worse | flat | unknown. Unknown unless a source shows change over time
trend_why: Which evidence shows it.     # expected when trend is not unknown
working_on:                             # groups only, never a private person
  - org: west-virginia-211              # a slug from orgs/
  - name: A group not in orgs/ yet
    url: https://example.org
gaps: [What is missing or hard to find]
topics: [money, housing]                # tags from doors.yaml
rank: 1                                 # 1 is the most pressing; unique
rank_why: The score behind the rank.    # optional
questions: [q01]                        # optional; findability question ids
issues: [123]                           # optional; idea issues for this need
get_help:                               # optional (#1248); our own pages for this need, best first
  - path: /utility-bills/               # a path on this site; the page must exist
    label: Help paying a heat, power or water bill
site_coverage:                          # optional (#1248); how well this site helps today
  level: good                           # good | partial | thin
  why: What the site has and what it lacks, in one or two sentences.
  checked: 2026-11-01
```

`get_help` shows on `/needs/` as "Where to get help on this site". `site_coverage` is a self-check of this site, not a measure of the need: `good` means a clear starting page and the main help is listed, `partial` means help is listed but spread out or missing a piece, and `thin` means little is on the site yet. Re-check it when a page for the need is added or changed. The full coverage review is in [`docs/research/needs-coverage.md`](../docs/research/needs-coverage.md).

`npm run check-content` also runs `scripts/check-needs.mjs`, which fails on: a field the schema does not name, evidence without a source url or checked date, a count that is not a whole number, a person instead of a group in `working_on`, an unknown topic or org, a repeated rank, and anything that looks personal (an email address, a phone number, or a quoted passage of six or more words). Signals are public and aggregate; never profile or quote a private person. Test data lives in `site/scripts/fixtures/needs/`, never in this folder.

## `secondhand/<slug>.yaml`: shops, free programs and online groups (#423)

Secondhand shops, free and lending programs, and online trading groups. The thrift, markets and swaps pages (#422) build from these. Dated sales and markets go in `calendar/` instead, with the topic `secondhand` or `market`.

```yaml
name: Example Thrift Shop
slug: example-thrift-shop
kind: charity-thrift      # see kinds below
area: westover            # see areas below
run_by: Example Animal Rescue  # who runs it, as the source names it
org: example-org          # optional; slug from orgs/ when the group has a record
address: "100 Example St, Westover, WV"   # optional; only a street address the source publishes
hours: Tuesday to Saturday, 10 a.m. to 7 p.m.   # optional; in words, as the source gives them
sells: Housewares, books, toys and furniture. No clothing.   # what it sells, lends or gives, in words
takes: Donations of housewares, books, toys and furniture.   # optional; what it accepts from you, in words
does_not_take: Clothing or mattresses.   # optional; what it turns away, in the source's words (#690)
drop_off: Tuesday to Saturday during store hours.   # optional; when and how to drop off, and any pickup
goods: [home, books]      # filter tags, see below
buys_from_you: false      # true when it pays cash or store credit for your things
funds_local_cause: Care for rescued animals.   # optional; what the money supports, as the source says
who_can_use: City of Morgantown residents 18 and up.   # optional; for free and lending programs
what_to_bring: A photo ID.   # optional
url: https://example.org   # the main button: the shop's or program's own page
url_label: Shop website    # optional; short button label. Default "Website"
status: confirmed          # confirmed | likely | unclear | closed
note: Moved from Morgantown Mall in 2024.   # optional; one short plain line
sources:
  - url: https://example.org/about
    checked: 2026-10-30
```

**Kinds:** `charity-thrift` (a thrift store whose sales fund a cause), `resale` (buys and sells used goods), `consignment` (sells your things and pays you a share), `vintage-antique`, `used-media` (books, records, games), `free-program` (gives things away), `lending` (lends things), `repair`, `online-group` (a buy, sell or trade group; a group for giving things away free is a `free-program` with area `online`).

**Areas:** `westover` (Westover, Mall Rd and Fairmont Rd), `downtown` (downtown and High St), `mileground` (Mileground and Mountaineer Mall), `university-ave` (University Ave and Sunnyside), `cheat-lake`, `elsewhere` (elsewhere in the county), `outside-county` (just over the county line), `online`.

**Goods tags** (for the quick filters): `clothes`, `kids`, `home` (furniture and home goods), `books` (books, records and games), `vintage` (antiques and vintage), `tools`, `electronics`, `building`.

**Status:**

- `confirmed`: a source dated 2025 or 2026, or the place's own current page, backs the details.
- `likely`: the place's own live page lists it, but nothing is dated. Cards say to check before you go.
- `unclear`: sources disagree or are old. **Never shown on a page.** Open a `needs-verification` issue for it.
- `closed`: closed or replaced. Never shown as open; a page may say it closed.

Every fact comes from a source page read in the same session, the same as other entries. Online groups are listed only when we could open the group's own page; we never quote members. No individual home yard sales, ratings, ads or paid placement.

Cards show "Not checked lately" once the oldest `checked` date is over 4 months old (#430).

## `boards/<slug>.yaml`: city boards and commissions

Shown on the Serve on a city board page (`/make-it-better/boards/`, #290). Never list members' names.

```yaml
name: Tree Board
slug: tree-board
org: city-of-morgantown        # slug from orgs/
decides: What the board does, in one or two plain sentences, from its own page.
meets: 4th Monday of every month, 3 p.m., Council Chambers
who_can_serve: City residents.   # optional; only what the source says
open_seats: 0                    # from the city's vacancy list
page_vacant: 1                   # optional; vacant seats the board's own page shows, when it differs from the list
section: other                   # optional; a board listed by name only under "Other city boards with open seats". Needs open_note (like "1 alternate seat") instead of decides and meets
# section: county                 # a County Commission board from the county's list: needs created and meets, no seat counts
url: https://www.morgantownwv.gov/264/Tree-Board
topics: [better]
sources:
  - url: https://www.morgantownwv.gov/264/Tree-Board
    checked: 2026-10-30
  - url: https://www.morgantownwv.gov/210/Volunteer-Opportunities
    checked: 2026-10-30
```

## `tonight/warming-shelter.yaml`: tonight's warming shelter status

One file, shown on `/tonight/` (#401). Update it each day in winter, after reading a same-day source.

```yaml
status: open              # not-announced | open | closed-tonight | season-over
checked: "2026-12-05 15:30"   # Morgantown date and time you read the source, quoted
where: 123 Example St, Morgantown   # needed when open
hours: 7 p.m. to 7 a.m.             # needed when open
rules:                    # optional; shown before anything else, in the source's words
  who: Adults 18 and older
  pets: No pets
  sobriety: ...
  id: ...
bus: ...                  # optional; how to get there
last_bus: ...             # optional
confirm_phone: "211"      # needed when open; a public number to confirm
confirm_label: ...        # optional; who answers
note: ...                 # optional; one plain sentence, like "No opening date has been announced yet."
sources:
  - url: https://example.org/warming-shelter
    checked: 2026-12-05
```

The page says "open" only when `checked` is today in Morgantown, both when the site builds and again on the phone, so a page saved from an earlier day reads "Not confirmed for today." There is never a bed count. `npm run check-content` checks the status, the `checked` format, and that an open shelter has `where`, `hours` and `confirm_phone`.

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

An example can be seasonal with optional `from` and `until` dates, written as quoted `"MM-DD"` and counted in Morgantown time, both days included:

```yaml
      - text: Flu or COVID shot
        href: /flu-shots/
        from: "09-01"   # optional; shows from this day
        until: "12-31"  # optional; shows through this day
```

With only `from`, it shows through December 31. With only `until`, it shows from January 1. A `from` later than `until` wraps the new year (`"11-01"` to `"03-31"` is November through March). Leave both out to show it all year. The site rebuilds every morning (`.github/workflows/site.yml`), so an example appears or goes away on the first build of its first or last day, with no extra schedule needed (#488). `npm run check-content` fails on a date that is not `"MM-DD"`.

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
- On the site, a card says "may be out of date" after 6 months without a check, or after 90 days for Make it better entries (topic `better`, and `boards/`), since seats and grant rounds change faster (#791).
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
- **Phone numbers come from the group or the government (#494).** A phone or text number must be on the group's own website or an official government page. Never take one from a directory, a news story, a search result or an AI answer: scammers plant fake support numbers there. If only a directory has the number, leave it out.
- **Check it is the right Morgantown (#494).** Make sure each source is about Morgantown or Monongalia County, West Virginia, not Morgantown, Kentucky or Indiana, and not a neighboring county. `npm run check-content` warns when an address leaves out WV or any text names Morgantown in another state, and the daily source check warns when a source page does.
- **Crisis, shelter and food-today details are re-checked every week (#494).** Every record named on the Where to stay tonight page, the food pages, the crisis strip and the Help now parts, the orgs behind them, and any record that names 988 or a crisis line. The Health check lists the ones last checked over 7 days ago (`content-recheck-weekly`). Re-check each phone number and hours on the group's own page.
- **Keep "Call to confirm" on anything that changes fast.** Hours, open status and bed or food availability always say to call first. The place cards do this on their own; keep it in any sentence you write about hours.

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

## Hiding an item

Any record in `orgs/`, `resources/`, `calendar/` or `secondhand/` can be taken off the site without deleting it (#519). Add a `hidden` block:

```yaml
hidden:
  reason: group-request   # group-request | unconfirmed-risky | overdue | other
  since: 2026-10-30       # Morgantown date it was hidden
  note: Hours changed; re-checking with the group's own page.  # optional; never a name or other personal detail
```

- **What it does.** The build leaves the record out of every page, the search index, `calendar.ics` and the counts. A page that names the record on purpose (a crisis page that always shows one shelter) keeps the name and says "We are re-checking this listing, so its details are off the site for now." in place of its phone, link, hours and sources, with a "Report a problem" link. A door step that points to it says the same.
- **What it does not do.** Hiding removes the record's facts. If a page also writes a fact about the item in its own words, that sentence stays, so open the page after you hide and fix the sentence if it is the part that is wrong.
- **Putting it back.** Delete the `hidden` block. Nothing else changes. Re-check the source first and update `checked`.
- **Hiding a feed item.** Copy the feed entry into a `calendar/` file with the same `slug` and add `hidden`. The hand-written entry wins, so the feed item stays off.
- **Checks.** `npm run check-content` still checks hidden records in full, so one can come back at any time, and fails if `hidden.reason` is missing or not one of the four, or `since` is not a date. The Health check lists every hidden item until it comes back.
- **211 and 988 cannot be hidden.** They show on every page. If one looks wrong, fix it from the line's own page the same day.
- **Who can merge.** A PR that only adds or changes `hidden` blocks does not wait for David, and the High stakes check does not flag it (`docs/COORDINATION.md`: "taking down or hiding a wrong item does not wait"). A PR that removes a `hidden` block is checked like any other content change.

## Confirmed by phone and the call queue

Some groups have no website, or only a page robots cannot read, so a phone call is the only way to check them (#164). After a person confirms a listing by phone, add to its file in `orgs/`, `resources/` or `places/`:

```yaml
phone_confirmed: 2026-11-02   # Morgantown date of the call
phone_confirmed_by: DS        # optional; the caller's initials (orgs and resources)
```

- **Never** write down the name of the person who answered, or anything they said about themselves.
- Call only the public number on the listing. What the call confirms still has to match the record: if something changed, fix the record, and if the change is on the group's own page, re-check that source too.
- The card shows "Confirmed by phone on <date>." after the checked date, and the out-of-date note once that date is over 6 months old.
- `npm run check-content` fails if `phone_confirmed` is not a date or is in the future, or `phone_confirmed_by` is not two or three capital letters.

**The call queue.** `npm run call-queue` in `site/` prints the list of calls to make, oldest first, with the number, why each one is there and what to ask (`--md FILE` writes it to a file). A listing is in it when it has a public phone number and either no source a robot can read (every source is `manual` in `source-rules.yaml`), no recent activity seen (places), or a past phone check. Making the calls waits on David's decision about who calls and from what number (#156).

## `indicators/<slug>.yaml`: how the county is doing

Official numbers for the "How is Mon County doing?" page (`/how-we-are-doing/`, #62), and later the data dashboard (#15). One file per number. Pages render only from these files.

```yaml
title: Children in poverty
slug: children-in-poverty
topic: health              # health | schools | safety
definition: "Percentage of people under age 18 in poverty."   # the publisher's own definition, word for word
unit: percent              # percent | number | years. Percents are written as a share: 0.129 for 12.9%
data_year: "2023"          # the year or span the number covers, as the publisher gives it (quoted)
release: County Health Rankings 2025
values:
  monongalia: 0.129
  west_virginia: 0.196     # optional comparisons
  united_states: 0.16
more: https://www.countyhealthrankings.org/health-data/west-virginia/monongalia  # optional; the human page
sources:
  - name: County Health Rankings 2025 data file
    url: https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_data2025_v3.csv
    checked: 2026-10-30
```

- **Charts and updates (#15).** A file can name its County Health Rankings measure under `chr:` (`measure: v024`, `trend_name: Children in poverty`). `node scripts/update-chr-indicators.mjs --check` in `site/` compares the file with County Health Rankings' public files, and `--write` fills `values`, `data_year` and `history` (Mon County and West Virginia by year, only after the source's last trend break), and sets `checked`. The page draws a chart from `history`. A monthly workflow (`.github/workflows/indicators.yml`) runs the check and opens an issue for Duet when the source changes. No key, no account.
- **Supplements (#1357).** CHR&R made no 2026 annual release; a March 2026 supplemental file refreshed 34 measures. An indicator on that file puts it first in `sources`, adds the supplement codebook as a source, and sets `chr.data_year` to the year the codebook gives for its measure (the trends file stops at the 2025 release, so the chart can end a year earlier than the number). `children-in-poverty` is not in the supplement and stays on the 2025 file.
- **Official sources only**, read in the same session: a government agency or a program that publishes the same data for every county. Never a real estate, "best places" or other commercial site.
- **Copy the number and its definition exactly.** Never compute a new number (a rank, a change, a per-person rate) the source does not give.
- **Describe, never judge.** No "good", "bad", "safe" or "failing". The page says what the numbers do and don't tell you.

## `facts/<topic>/<slug>.yaml`: sentences that are not listings

Tier 2 of ADR 0007: a sentence a page needs that is not an org, resource or date (a rule from a county page, a definition, a set-out rule) is a record here, not text typed into the page (#122). Pages show it with the `Fact` component.

```yaml
slug: tires
text: "**Tires:** a state tire collection runs monthly in Morgantown, except December, January and February."  # what the page shows; **bold** and [label](link) only
quote: "The Tire Collection Events are NOT operated in December, January or February."  # the source's exact words
sources:
  - url: https://www.monongaliacountyswa.com/tires
    name: Monongalia County Solid Waste Authority   # optional
    checked: 2026-10-30   # Morgantown date you read it
recheck_days: 90         # optional: about 365 for a definition, 180 for a phone, 90 for hours or a schedule, 30 while waiting on a date. Default: 6 months
phone: "304-376-0036"    # optional; adds a Call button
place: "4120 Fairmont Rd, Morgantown, WV"  # optional; adds a Directions button
```

Past `recheck_days` (or 6 months), the page says the fact may be out of date, and the Health check lists it (`facts-due`). Re-read the source: if it still says the same, update `checked`; if not, fix `text` and `quote`.

## `pdf-pages/<slug>.yaml`: a hard-to-read PDF as short lists (#393)

The useful part of a PDF (a fee form, a schedule, a guide) as headings and short lists a phone can show, with the original PDF linked. Pages show a record with the `FromPdf` component. Nothing is a wide table, so nothing squeezes on a phone (#917).

```yaml
slug: monchd-fees-2026-27
title: Permit Fees and Fees for Service, Fiscal Year 2026-2027   # the PDF's own title
publisher: Monongalia County Health Department
pdf: https://example.org/fees.pdf          # optional when each item links its own PDF
pdf_date: "Fiscal Year 2026-2027"          # the date printed on the PDF, in its words. Needed with pdf
found_on: https://example.org/fees         # optional; the official page that links the PDF
intro: One plain sentence.                 # optional
recheck_days: 120                          # optional; default 6 months
sources:
  - url: https://example.org/fees.pdf
    checked: 2026-10-31
sections:
  - heading: Septic systems                # what residents look for
    id: septic                             # optional anchor
    note: The form lists these under "Land Development".   # optional
    items:
      - name: Conventional Sewage System Permit             # the PDF's label
        lines: ["$222"]
        links:                                              # optional
          - label: Full schedule (PDF)
            url: https://example.org/route.pdf
            date: "Effective August, 2018"                   # needed on a PDF link
            lang: es                                         # optional; the link's language if not English
            # saved: "February 16, 2025"                    # instead of date, only when no date is printed: the file's save date
      - A plain line of text is also an item.
```

Rules: copy labels, fees, days and times exactly as printed; put the PDF's own words in quotes where you add a word around them. Never reword rules or eligibility. If the PDF is a scan, read it off the page image and say so in a comment at the top of the file. If the PDF disagrees with a newer official page, say who says what, or leave the item off and open a `needs-verification` issue. `npm run check-content` checks the fields, the dates and that every PDF link has its date.

## `watch/<group>.yaml` and `checklists/<id>.yaml`: recurring checks (not listings)

Neither folder shows on the site. Both feed issues for a person, from the daily Source check. See [`docs/operations/recurring-checks.md`](../docs/operations/recurring-checks.md).

- `watch/`: pages a robot reads every day, comparing only the part between `start` and `end` (#166). Optional list fields: `season` (`"11-01 to 03-31"`), `words`, `todo`, `plan`. A change opens or comments on one issue per list. Field notes are at the top of `watch/food.yaml` and `watch/shelter.yaml`.
- `checklists/`: what a robot cannot read (#752, #718, #793). One standing issue per file, refreshed each week. Item fields: `text`, `url`, `when` (`month` or `quarter`: only in the first week of one), `months` (only in those months), `from` (not before that date), `run` (a computed list: `secondhand-due`, `past-sale-dates`, `better-stale-soon`). Preview with `npm run checklists` in `site/`.

## `translations/<lang>/<kind>/<name>.yaml`: other languages (not on the site yet)

Sidecar files with reviewed translations of a record, page or part. They hold only words, never facts: numbers, hours, addresses and links always come from the English record. No language is turned on yet (#1067). Schema, the staleness hash and how to add one: [`docs/process/translations.md`](../docs/process/translations.md).

## `agendas/<body>-<date>.yaml`: plain-language agenda guides (#529)

One file per coming meeting with a posted agenda, for any body listed in `BODIES` in `site/src/lib/agendas.mjs` (City Council, County Commission, school board, city boards, regional boards and town councils), shown on `/meetings/agendas/` and the body's own page until the meeting day passes. Every agenda item keeps its exact title, plus a `kind` and one neutral `line`. Neutrality rules: [`docs/decisions/2026-10-31-2132-agenda-guide-neutrality.md`](../docs/decisions/2026-10-31-2132-agenda-guide-neutrality.md). Fields, kinds and the weekly steps: [`docs/process/agenda-guides.md`](../docs/process/agenda-guides.md). `npm run check-content` checks the fields and fails a line with a judging word or an em dash (`site/src/lib/agendas.mjs`).

## `minutes/<body>-<date>.yaml`: what was decided (#529)

One file per past meeting with posted minutes, shown on the body's page under `/meetings/agendas/<body>/` for 30 days after the meeting. It lists every motion the official minutes record, in order: `motion` and `result` copied as written, `vote` as the minutes give it, and `item` (the agenda number or title) when the minutes give one. `minutes_status` is `Approved`, `Draft` or `Not marked`, as the minutes or the posting page say. Never a summary of debate, comments or reasons. Steps: "What was decided" in [`docs/process/agenda-guides.md`](../docs/process/agenda-guides.md). `npm run check-content` checks the fields (`decidedProblems` in `site/src/lib/agendas.mjs`).
