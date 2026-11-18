# 2026-11-07: Who sets the rules for this, on the bill and housing pages (#1689, waits for David)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #442's next step needs a person, because WVU Extension refuses automated reads.
  - #1612 is done except for high-stakes pages.
  - #1689's next step, written on the issue November 4, was the high-stakes pages.
- **Chose:** #1689 part 2, as a `for:david` PR. Every page left is high stakes (utility bills, renting, the housing voucher page, and `/needs/`, which names 211).
- **Shipped:**
  - **`who-decides.mjs`** gains two bodies, so they also appear on `/who-decides/`:
    - **the Public Service Commission:** who writes the electric and gas rules, from rules 150CSR3 and 150CSR4. How commissioners are chosen comes from W. Va. Code 24-1-3, read 2026-11-07. The PSC's own site still refuses reads, so no meeting times.
    - **the Fairmont-Morgantown Housing Authority board:** from its records checked November 4.
  - **`utility-bills` need:** the PSC (payment plans, notice, no shutoffs on cold days), and MUB, described only by what is sourced: it runs water, wastewater and stormwater, and the state shutoff rules do not cover water.
  - **`housing-costs` need:** City Council, with the city's rental registration and every-3-years inspection from the Rental Information page read 2026-11-07, and the Housing Authority board.
  - The block shows on `/utility-bills/`, `/renting/` and `/after-you-apply/housing-voucher/`. `/needs/` lists each need's bodies with a source link.
- **Left off:** who sets MUB's water rates. News reports say City Council approves them by ordinance, but MUB's rate page now returns 404 and no official page read today says so. That is a `needs-verification` issue.
- **Scoreboard:** none directly. The "point" role from the levers doc. Check at the November 16 retro whether `/who-decides/` views rise.
