# 2026-11-01: Lighter pages and a slow 3G test (#529, wave 8)

- **Considered:** many residents use old phones, prepaid data or spotty signal. Every page carried about 30 KB (before compression) of styles for parts it does not show, because the build puts the styles of dozens of parts into every page. The weight budget (urgent 100 KB, everyday 300 KB) was so loose that a page could double without failing.
- **Chose:** remove only styles that cannot apply, at build time, with no new tool. Cost: $0.
- **Shipped:**
  - `site/src/lib/prune-css.mjs`, run by `astro.config.mjs` after each build. A part's styles are tagged with that part's id; if a page has no element with that id, its rules are dropped. Shared styles, fonts and anything it cannot read stay. Tests in `site/test/prune-css.test.mjs`. It removes about 15.6 MB across the 930 built pages, about 5 KB per page after compression.
  - Tighter budgets in `site/scripts/check-weight.mjs`: urgent pages under 50 KB, everyday pages under 150 KB. Tonight, utility bills, after a storm, mental health, drugs and alcohol, and protective orders now count as urgent too. `docs/design/presentation.md` updated.
  - `site/scripts/slow-3g.mjs` (`npm run slow-3g`): opens the top 20 pages in Chromium on Chrome's Slow 3G profile (2 second round trip, about 50 KB/s) with the CPU slowed 4 times, cold, 3 runs each, and prints the median first-content time and bytes.
- **Checked:** screenshots of 87 pages (the top 20 plus 67 picked at random), light and dark, 320 and 1024 pixels wide, before and after: 0 pixel differences.
- **Measured** (slow 3G, first content, median of 3):

| Page | Before | After | KB before | KB after |
|---|---|---|---|---|
| / | 2.41 s | 2.26 s | 35.2 | 30.1 |
| /stay-tonight/ | 2.39 s | 2.25 s | 35.7 | 30.8 |
| /tonight/ | 2.35 s | 2.25 s | 32.0 | 26.7 |
| /help/food/ | 2.34 s | 2.28 s | 30.9 | 25.6 |
| /help/food/today/ | 2.33 s | 2.25 s | 30.7 | 25.4 |
| /help/food/today/other/ | 2.38 s | 2.24 s | 34.9 | 29.8 |
| /utility-bills/ | 2.34 s | 2.25 s | 34.9 | 29.8 |
| /after-a-storm/ | 2.34 s | 2.26 s | 34.2 | 29.0 |
| /mental-health/ | 2.40 s | 2.28 s | 37.3 | 32.3 |
| /drugs-and-alcohol/ | 2.36 s | 2.29 s | 36.7 | 31.6 |
| /protective-orders/ | 2.37 s | 2.28 s | 35.2 | 30.0 |
| /money/ | 2.34 s | 2.30 s | 43.2 | 38.2 |
| /care/ | 2.34 s | 2.26 s | 39.8 | 34.8 |
| /living-here/ | 2.33 s | 2.25 s | 39.6 | 34.5 |
| /family/ | 2.35 s | 2.26 s | 40.8 | 35.7 |
| /community/ | 2.34 s | 2.25 s | 36.5 | 31.4 |
| /calendar/ | 2.42 s | 2.30 s | 77.2 | 73.9 |
| /make-a-list/ | 2.40 s | 2.25 s | 97.2 | 92.2 |
| /before-you-call/ | 2.53 s | 2.46 s | 68.9 | 64.2 |
| /about/ | 2.34 s | 2.25 s | 33.7 | 28.5 |

- **What the numbers say:** pages were already light. On slow 3G, about 2 seconds of the wait is the round trip itself, which no page change can remove. The gain is about 0.1 seconds and 5 KB a page, which adds up for someone on prepaid data. Saved copies (the service worker) are what help most with no signal.
- **Scoreboard:** none directly. Rubric A8 (weight) was already at its top score for every page.
