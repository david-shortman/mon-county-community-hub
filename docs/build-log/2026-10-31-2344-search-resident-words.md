# Search finds pages in residents' own words

**What.** The site search now ranks pages by how many of the reader's words they contain, maps a short list of everyday words to the words our pages use (garbage to trash, rehab and detox to treatment, toothache to dentist, daycare to child care, senior to older, and a few more), skips filler words like "near me" and "what do I do", and puts printout and help-giver pages after the main pages. When no page has every word, the status line says so.

**Why.** In 30 simulated resident walkthroughs on October 31, 2026 (made-up tasks, not real residents; see `docs/reviews/2026-10-31-simulated-walkthroughs.md`), 18 of 60 searches did not put the right page in the top 3. "detox near me" found nothing, "garbage pickup" missed the trash page, and printout pages often ranked above the page they copy. After this change, 49 of 60 put the right page in the top 3. Most of the rest are pages we do not have yet (home bakeries, help paying for child care), filed as issues.

**How to check.** `site/e2e/tools.test.mjs` has a test with five resident phrases that must each find their page in the top 3. Part of #529.
