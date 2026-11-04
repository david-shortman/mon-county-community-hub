# 2026-11-04: Who sets the rules for this, first slice (#1689)

- **Considered:**
  - The week 2 queue: #1412 waits on pantry listings (#1413), #202 and #60 are claimed, and #1394's remaining cards are high stakes.
  - The blog follow-ups (#1703 feeds, #1705 checks) help no resident until a first post is up.
  - #1689 points residents from a help page to the board that makes its rules.
- **Chose:** #1689, starting with the bus pages. Three of the four first pages in the issue (`/utility-bills/`, `/renting/`, `/after-you-apply/housing-voucher/`) are high stakes, and so is `/needs/`, since it names 211. Those go in a `for:david` PR next.
- **Shipped:**
  - `decided_by` in the needs schema and the API contract.
  - `check-needs` checks it, with new self-test cases.
  - `site/src/lib/rule-setters.mjs` and `WhoSetsRules.astro`.
  - The transportation need now names the Mountain Line board and the MPO Policy Board, and the block shows on `/bus-passes/` and `/getting-around/`.
  - A building blocks row in `docs/design/presentation.md`, and a decision file.
- **Facts checked today:**
  - The county's boards page says the Transit Authority was created under WV Code 8-27-1.
  - WV Code 8-27-10(q) lets these authorities set fees, rates, routes and schedules, with a public hearing before a new or higher fare.
  - The MPO's page says its Policy Board approves the long-range plan and project list that set priorities for federal transportation money.
  - The county's page also says the Transit Authority "meets quarterly", next to a monthly time. `/who-decides/` already says the sources differ on when it meets.
- **Scoreboard:** none directly. It answers the "point" role in the levers doc. Check at the November 16 retro whether "who decides bus fares" style questions find `/bus-passes/` in site search.
