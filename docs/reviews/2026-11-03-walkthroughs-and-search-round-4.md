# Walkthroughs and search, round 4: did a day of changes make things easier or harder to find?

**Date:** November 3, 2026. **Who:** Claude Code, sprint wave 14, walkthroughs and search lane (see #529).

> **Simulated, not real residents.** A script and Claude walked each persona's question on the built site at phone width, with made-up search words, and ran the site search test on words we wrote. This shows where a person on a phone might get stuck. It is not resident feedback, and nothing here says what real people do.

## Why we ran it

About 96 commits landed on `main` between round 3 ([write-up](2026-11-03-persona-walkthroughs.md)) and this run: new pages, the What help finder, rewording, shorter titles and new card details. This run checks whether people can still find what they need.

## What we did

- **Persona walkthroughs:** the same 32 tasks ([`tasks-personas.yaml`](../../content/findability/walkthroughs/tasks-personas.yaml), run with `--after` so each task uses its current landing page), the same `walk.js` and `score.py`, on `main` at 59d1e15. We also reran the Family door tasks ([`tasks-family-door.yaml`](../../content/findability/walkthroughs/tasks-family-door.yaml)) to see the door's jump list from #1589.
- **Search test:** `npm run search-test` on the same build, saved as [`2026-11-03-1300.json`](../../content/findability/search-runs/2026-11-03-1300.json). The last saved run was [`2026-11-01-0829.json`](../../content/findability/search-runs/2026-11-01-0829.json). The query set grew from 246 to 285 since then, so we compare the 246 queries both runs share.
- **Read the openings** of the five persona landing pages that changed since round 3 (Mental health, Utility bills, No insurance, Turning 65, Renting). Each still opens with the answer.

Results with a note on every task that changed: [`2026-11-03-personas-round-4.yaml`](../../content/findability/walkthroughs/2026-11-03-personas-round-4.yaml).

## Summary

| | Round 3 (after its fixes) | Round 4, `main` at start | Round 4, with this lane's words | Also with open PR #1650 |
|---|---|---|---|---|
| Persona score (0 to 100) | 87 | 86 | 87 | not walked |
| Landing page answers the question (Claude's read) | 29 of 32 | 29 of 32 | 29 of 32 | |
| Persona searches with the answer in the top 3 (of 64) | 49 | 47 | 48 | 49 |
| Dead ends | 0 | 0 | 0 | |
| Search test, the 246 shared queries | 229 (Nov 1) | 224 | | |
| Search test, all 285 queries | | 259 (90.9%) | 262 (91.9%) | 268 (94.0%) |

"With this lane's words" counts the words in both PRs from this lane, including the ones that wait for David. The #1650 column was run in Node with that PR's search code, not walked in a browser.

**Findability got a little worse, and nearly all of the loss has one cause.** The What help finder has 42 results pages. Since #1597 each one names its picks in its heading ("Places that may help with a heat, water or power bill"), so they carry the words people search for ("bill", "rent", "stay") and fill the top 3 ahead of the guides. On the shared queries, 6 of the 7 lost searches are this: heating bill, water bill, eviction, evicted, evicition and where can I stay tonight. One persona search, "help at home for disability", fell from 2nd to 9th the same way. Open PR #1650 (waits for David) puts these pages after the guides and wins back all seven. The seventh lost search, "suicide", is being handled in #1647.

**Everything else held.** No new dead ends, the landing pages still answer the same 29 of 32 questions, and the new pages added 39 queries, 35 of them hits. Small moves: "soil test wv" fell from 1st to 4th; "landlord wont fix" and "when is trash pickup" now hit.

**The Family door jump list works.** For p12 (disability) it cuts the door from 10 screens of scrolling to 3 taps and 4 screens. p12 still scores lowest (8 of 18) because its landing page is a link hub with no checked date of its own.

## What we fixed

- **Also called words** for the soil test page: soil test, soil testing, soil sample. "soil test wv" goes from 4th to 3rd. This PR.
- **One expected page was wrong.** A search for "Health Right" finds the clinic's own group page first, which answers it (it has the phone number and who it serves). Added that page to the query's expected list. This PR.
- **Words for benefits and shelter pages, waiting for David** (separate PR): TANF and cash assistance for File today (the page says "cash help for families (TANF)"), health insurance marketplace for No insurance (the page covers the HealthCare.gov Marketplace), and warming center for Stay tonight (the page has the winter warming shelter line). TANF and "obamacare" (which search already reads as "marketplace") become hits.

## Still missing, and why words alone will not fix them

- **Full questions lose to pages full of small words.** "where do I get narcan" misses but "get narcan" hits; "I need a dentist but have no insurance" misses but "dentist no insurance" hits. The search also runs the whole sentence, which favors pages that use "where", "do" and "I" a lot. Running only the topic words fixes 3 queries and breaks 3 others ("groceries help", "Mon Power", "WV WORKS"), so it is not a clean fix. Question searches are at 34 of 41 (82.9%), the weakest kind.
- **Short common words rank long pages first.** "free food" puts Cottage food first even though Food help already has "free food" as an Also called word. "gardening" puts the soil test page first even though Grow food and flowers has "gardening". "things to do in morgantown" becomes just "things".
- **No page answers it yet:** bulk trash pickup, DMV office hours (pages give the phone number and say to call), AA meetings (Help with drugs or alcohol never names support meetings) and what to do if SNAP benefits are stolen. These are content gaps, not search problems.
- **Search order changes results a little.** Pagefind matches the last word as the start of longer words, but only in parts of the index it has already loaded. So the same search can give a slightly different list depending on what was searched before. Run cold, each query on its own, the test scores 261 instead of 259 ("police non emergency" and "where can I see a doctor with no insurance" hit). The test always runs in the same order, so runs still compare.

## Limits

- Simulated. A script and Claude, not people.
- Tap paths are the ones we judged a resident would take from the home page's own words, the same as round 3.
- "Landing page answers the question" is Claude's own reading.
- We did not re-check facts against sources in this run.
- The search test's query words are ours, not collected from visitors. The site logs no searches.
