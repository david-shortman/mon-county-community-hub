# 2026-11-03: Walkthroughs and search, round 4 (wave 14, #529)

- **Considered:** about 96 commits landed after round 3. Did the persona walkthroughs and the site search test get better or worse? Simulated, not resident feedback.
- **Found:** a little worse. Persona searches with the answer in the top 3 went from 49 to 47 of 64, and the search test went from 229 to 224 on the 246 queries both runs share. Six of the seven lost searches (heating bill, water bill, eviction, where can I stay tonight) come from the What help finder's results pages crowding out the guides. No new dead ends, and landing pages still answer 29 of 32 questions.
- **Shipped:** Also called words for the soil test page, and one corrected expected page in the search test (Health Right). Words for File today, No insurance and Stay tonight wait for David in a separate PR.
- **Measured:** search test 259 to 260 of 285 with this PR; 262 with the words that wait for David; 268 (94.0%) with open PR #1650 too. Write-up: `docs/reviews/2026-11-03-walkthroughs-and-search-round-4.md`.
- **Left:** full-question searches (34 of 41), short common words ranking long pages first, and content gaps (bulk trash, DMV hours, support meetings, stolen SNAP benefits).
