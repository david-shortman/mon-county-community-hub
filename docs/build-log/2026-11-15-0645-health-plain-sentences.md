# Plain sentences for the health numbers, and round chart tops

- **Issue:** #2002 (sprint wave 21, #529).
- **What changed:** each health indicator file in `content/indicators/` now has a `plain` field: one or two short sentences saying what the number means and what it leaves out, written from County Health Rankings' own measure page for it (2025), with that page's link and a checked date. Premature death first: "Each death before age 75 adds the years left until 75..." `check-content` checks the field (text, under 45 words, no em dash, a link and a date).
- **Charts:** `TrendChart.astro` gave counts and rates an axis top equal to the largest value, so ticks read 6,662 and 13,324. It now rounds up to the next multiple of 2 in the second digit (14,000, with 7,000 halfway). The rule is in `site/src/lib/chart-scale.mjs`, tested in `site/test/chart-scale.test.mjs`. Percent charts are unchanged.
- **Not done yet:** showing the sentence on `/how-we-are-doing/` is one line in `site/src/pages/how-we-are-doing.astro`, which the open PR #1941 changes. That line waits for #1941 to merge, so the two PRs do not collide.
- **Why:** County Health Rankings' definitions are exact but hard to read ("Years of potential life lost before age 75 per 100,000 population (age-adjusted)").
