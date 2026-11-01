# Search page uses the search plan; help when nothing matches (#529, wave 6)

**What:** The search page (`/search/`) now runs what people type through `site/src/lib/search-plan.mjs`: common misspellings are fixed and the page says so ("we fixed the spelling of ..."), question words are dropped, and when no page has every word it shows pages with most of them and says that too. When nothing matches, a short "Try this" box points to plain words, Help now, 211 and all topics.

**Also:** "Also called" lines on food, benefits, shelter and safety pages (for example "food stamps, EBT" on Apply for SNAP, "warming center" on Tonight), and search skips the place lists on printable sheets, which used to crowd out the guides.

**Scores** (249 queries, top 3, `npm run search-test`): main before #529, 181 (72.7%). After this PR, 233 (93.6%). Misspellings 17 of 17. The 16 misses left are mostly gaps (no page covers barking dogs, bulk trash or AA meetings) or long pages that rank lower; they are listed in the CI report.

**Waits for David:** it changes the search page, which names 211, and what food, benefits and shelter pages show.
