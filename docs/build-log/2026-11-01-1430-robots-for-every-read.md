# Every automated read checks robots.txt

Sprint wave 7 (#529). #1009 marked Google Calendar pages on the weekly checklists as person-only because their robots.txt asks robots to stay out. The calendar feeds, meetings, live numbers, weather and Health check still read on their own without checking. Now they all follow the same rule.

- **Shared check:** `site/src/lib/robots.mjs` (moved out of the Source check and shared). `fetchWithRetry` (#930) checks robots.txt before every read and on every redirect, and never requests a disallowed path. When unsure (an unreadable robots.txt, or a rule that differs only in case) it does not read.
- **Google Calendar feeds off:** the Monongalia Arts Center and Morgantown Farmers Market adapters have `off`. Their saved events stay with their checked dates until they pass. A person reads each source on a weekly checklist (centers, and sale dates).
- **Found by the audit:** the City iCalendar feed (closed to robots since 2026-10-21) and the BLS API now fall back to saved copies. The weather moved from `api.weather.gov` to the forecast page's JSON on `forecast.weather.gov`, which allows it.
- **Feed health** shows `status: "off"` or the robots.txt reason with `robots_txt_disallows: true`.
- **Audit:** `node scripts/robots-audit.mjs` prints every automated address and its robots.txt result. Policy and results: `docs/operations/automated-reads.md`. Discoveries: City calendar feed, federal data APIs.
- **Tests:** `site/test/robots.test.mjs` (14 tests).

Cost: $0.
