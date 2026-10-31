# Watch plan: community centers and halls (#458)

How the Community centers and halls section (#450) stays current. Most centers post only on Facebook, which agents cannot read (#166), so this plan stacks free layers. Cost: $0 for everything here.

## 1. Daily, already running: the source check

`site/scripts/check-sources.mjs` (the Source check workflow, daily at 11:41 UTC) builds its list from every YAML file in `content/`, so every source in `content/places/` and every center event in `content/calendar/` is checked with no extra setup. It reports:

- **broken** or **moved** links, so a dead center page shows up the next morning;
- **changed** page text, the hint to re-read a center page;
- **phone** numbers in a record that no longer appear on its sources.

Facebook links are `manual` in `content/source-rules.yaml` and are never fetched.

## 2. Stale rule, already built

`placeStatus()` in `site/src/lib/places.mjs`: a place marked `active` whose `last_activity_seen` is over 6 months old reads "No recent activity seen, call first" on its card and page. A place found only in county lists starts as `no-recent-activity`. Card and page checked dates are the oldest source date, and past 6 months they say the item may be out of date (#39).

## 3. Weekly: a read of pages with no fixed address

Some sources change address every week, so the daily check cannot follow them. Once a week (Duet's sweep, tracked in #752):

| Source | What to look for | Where it goes |
|---|---|---|
| Dominion Post weekly "Events and opportunities" listing (`dominionpost.com/<date>/events-opportunities-<n>`) | Dinners, bingo, bazaars and festivals at a listed place, with a date | `content/calendar/<place>-<event>-<date>.yaml` with `venue:` |
| Dominion Post weekly "Senior news" column (`dominionpost.com/<date>/senior-news-<n>`) | Westside, Clay-Battelle and Senior Monongalians: dated events, changed hours, dues or lunch days | calendar entries; `regular`, `membership` in the place file |
| Smithtown's public calendar feed (linked from `smithtowncommunity.com/calendar.html`) | New dated events | calendar entries. Leave times off: the feed's stored times are wrong on some entries |
| Cheat Lake VFD events calendar (embedded on `cheatlakefire.org/events`) | Public events only. Skip rentals and anything marked private | calendar entries |
| BOPARC pages (Wiles Hill, Marilla, Dorsey's Knob) and the BOPARC closures page | Marilla reopening date and new rates; price changes | the place file |
| County parks events page (`monongaliacounty.gov/parks_and_rec_events/`) | Mason-Dixon events, once the page shows a year | calendar entries |

Rules for the weekly read:

- **Event facts only** from news columns: what, where, date, time, price, with a link. Never copy their text.
- **No event without a confirmed year.** A listing published this month that names the weekday counts.
- **No private people.** Leave out volunteers' names and numbers printed in listings.
- Each change is a PR that cites the page read and updates `checked`. If nothing changed, log "no change" on the `for:duet` issue with the date.
- If a center seems closed or moved, do not guess: open a `needs-verification` issue.

## 3a. Daily, automated since 2026-10-31: the close watch (#752)

The pages in section 3 that have a fixed address are now on a watch list, [`content/watch/centers.yaml`](../../content/watch/centers.yaml), inside the daily Source check (same system as the pantry watch, [plan](2026-10-31-pantry-watch.md)): the BOPARC closures, events, Marilla, Wiles Hill and Dorsey's Knob pages, the county parks events page, the Westside Senior Center page and Senior Monongalians' events page. Only the main part of each page is compared, digits included, so a new date or price counts. Marilla's "re-opening date will be determined" line is saved, so its removal alerts.

When one changes, the workflow opens or comments on **one** "Community center or park event page changed" issue for a person, with what to do. Nothing is added to the site on its own.

Still read by a person each week: the Dominion Post columns (a new address each week) and the Smithtown and Cheat Lake calendars (Google Calendar, whose robots.txt asks robots to stay out).

## 4. Later, waiting on David

- **Facebook gap (#459):** a monthly Facebook pass by a person, phone checks through the call queue (#156, #165), or a "send us your event" form (#197).
- **Live feeds:** the Smithtown and Cheat Lake Google Calendar feeds could become feed adapters (tier 1 in `content/README.md`), but only with a filter that drops private rentals and with times left off. Worth doing once the centers agree to it through outreach.
- **Outreach:** asking centers to check their listings waits until David says the site is ready (#450).

## First weekly read: 2026-10-30

Read the Dominion Post listings of October 16, 20, 23, 27 and 30, the Smithtown and Cheat Lake calendars, and the BOPARC and county park pages. Result: 8 events added (#699); no other changes since the places were seeded (#587) the same day.
