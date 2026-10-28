# Content data

Structured data the site is built from. One file per entry, YAML, so humans and Claude can both edit it and changes show up clearly in PRs.

**Draft schema (v0).** Expect it to change once the first topic area is built.

## `orgs/<slug>.yaml`: organizations

```yaml
name: Example Organization
slug: example-organization
kind: nonprofit        # nonprofit | government | community-group | business | school | faith
website: https://example.org
summary: One or two plain-language sentences on what they do.
topics: [poverty, food]
area: monongalia-county # or morgantown, statewide, etc.
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
what_to_do: Call to book an appointment, January through April.
contact:
  phone: "304-555-0100"     # public organizational contact only
  url: https://example.org/tax
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

## Rules

- Only public organizational contact details. Never a private person's info.
- Every entry has at least one source with a `checked` date.
- Entries older than 6 months since `checked` get flagged for re-verification.
