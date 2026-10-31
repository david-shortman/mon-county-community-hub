# 2026-10-31: Daily watch on community center and sale date pages (#752, #718)

- **Considered:** a separate weekly job for each chore. Chose two more watch lists in the daily Source check instead (the pantry watch system), so there is one system, one politeness budget and one issue pattern.
- **Did:** `content/watch/centers.yaml` (BOPARC closures, events, Marilla, Wiles Hill and Dorsey's Knob pages, county parks events, Westside Senior Center, Senior Monongalians events, plus the Smithtown and Cheat Lake Google calendars as by-hand checks) and `content/watch/secondhand.yaml` (Moonlight Market, MRTC Handmade Market, Farmers Market dates, plus three pages that block robots). Every marker and saved quote was tested on the live pages on 2026-10-31.
- **Watch engine, small optional fields** (`site/scripts/watch.mjs`), any list can use them and the food list behaves as before:
  - `todo` and `plan`: the list's own instructions and doc in its issue, instead of the pantry text.
  - `season` (for example `11-01 to 03-31`, Morgantown dates): outside it the list is skipped and its saved state dropped. For the winter shelter list (#863, its own PR, which waits for David).
  - `words`: on the first check of a season a page that mentions one opens the issue, and every change shows the lines around each word.
  - A calendar feed's `DTSTAMP` lines no longer count as a change.
  Self-tests cover each one.
- **Result:** when one of these pages changes, the workflow opens or comments on one grouped issue per list for a person, with that list's own instructions. No event or date is added to the site on its own.
- **Left for people, and why:** the Dominion Post columns have a new address each week. Google Calendar's robots.txt asks robots to stay out. The WVU calendar and card show and festival lists change every day, which would make an alarm every day. These stay on the weekly read.
- **Docs:** a new section in `docs/plans/2026-10-30-centers-watch.md` and `docs/operations/secondhand-checks.md`.
- **Cost:** $0. About 11 more page requests a day in the free Source check job. No Claude calls, accounts or keys.
