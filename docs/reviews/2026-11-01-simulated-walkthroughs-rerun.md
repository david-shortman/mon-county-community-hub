# Simulated walkthroughs, rerun: what a day of about 70 merges changed

**Date:** November 1, 2026. **Who:** Claude Code, sprint wave 8, measurement lane (#529).

> **Simulated, not real residents.** These are made-up tasks that Claude walked with a script on the built site, and made-up search queries. They show where a stressed person on a phone might get stuck. They are not resident feedback, and nothing here says what real people do. Real feedback still has to come from residents (charter level 4).

## What we did

- **Reran the 30 tasks** from the [October 31 run](2026-10-31-simulated-walkthroughs.md) with the same tasks and scripts (`walk.js --after`, `score.py`), at 390 by 844, on main at the start of this run (`ac78619`).
- **Added 20 tasks** for pages added October 31 and November 1: after you apply guides, life events, towns, `/for/` pages, parking, protective orders, mortgage help, holidays, plain-language agendas and Find your people. They are in [`tasks-new-pages.yaml`](../../content/findability/walkthroughs/tasks-new-pages.yaml) (ids n01 to n20).
- **Reran the search test** (`npm run search-test`, 246 queries), and also ran the same 246 queries through the real `/search/` page in a browser ([`page-search.js`](../../content/findability/walkthroughs/page-search.js)). The two differ; see below.
- **Rescored the findability questions.** `score.py` on the latest run file, plus a fresh check of which of the 45 questions now have an answer page. The web search part (does our page show up in a plain web search) was not rerun.
- **Fixed** the most common problems in small PRs, then measured again on a local build with the open fix PRs combined.

Results with a note on each task that changed: [`2026-11-01.yaml`](../../content/findability/walkthroughs/2026-11-01.yaml) (the 30) and [`2026-11-01-new-pages.yaml`](../../content/findability/walkthroughs/2026-11-01-new-pages.yaml) (the 20).

## Summary

| | Oct 31, after fixes | Nov 1, main at start | Nov 1, with this lane's fixes |
|---|---|---|---|
| **30 old tasks**, score (0 to 100) | 88 | 90 | 91 |
| Dead ends | 0 | 0 | 0 |
| Searches with the answer in the top 3 (of 60) | 50 | 54 | 55 |
| IA2 steps (0 to 3) | 1.57 | 1.87 | 1.87 |
| **20 new tasks**, score | | 73 | 74 |
| Searches in the top 3 (of 40) | | 28 | 31 |
| **Search test** (`npm run search-test`, of 246) | 219 | 208 | 214 |
| **Real search page**, same 246 queries | not measured | 203 | **228** |
| **Findability questions** with an answer page (of 45) | 38 | 43 | 43 |

"With this lane's fixes" counts #1250 and #1265 (merged) and #1254 and #1274 (open, wait for David), built together with main at `8353cba`. The search test's 214 also includes other lanes' merges during the run.

**What the day's merges did for the old 30 tasks: 88 to 90.** Steps got shorter (door choices from #1171 and jump lists from #1174 and #1214): property tax went from 17 screens of scrolling to 5, caregiving from 12 to 3, a death in the family from 12 to 9. Search found more answers. Two tasks went down: the bus pass page had no tap-to-call number (fixed in #1250), and Community centers keeps its checked dates in closed sections, which the script cannot see.

**The new pages score lower: 73.** Pages that answer directly do well: after you apply guides, towns, parking, mortgage help and holidays score 14 to 18 of 18. Ten of the 20 tasks end on a link hub (life events, `/for/` pages, the agenda list, Find your people). Those 10 average 56 of 100; the other 10 average 91. A hub shows no checked date and no number of its own, so it scores low on sources and next step by design; the answer is one tap further. Whether hubs should show the first step's number is #1288.

**The search test was measuring code residents do not get.** `npm run search-test` scores `site/src/lib/search-plan.mjs` (#1151). The search page runs its own code (#1153) and never switched, so it had no spelling fixes: "dentsit", "sheltor", "recyling" and "liscense" found nothing on the real page. The real page scored 203, not 208. And the 174 group profile pages (`/groups/`), none of which showed in the October 31 search run, pushed guides out of the top 3 for everyday words like "counseling", "free clinic" and "barking dog". #1274 fixes both: 206 to 228, with no query getting worse.

**Findability questions.** `content/findability/score.py` on the latest run (`2026-10-31b.yaml`) still gives 71 of 100, because the web search part was not rerun this time. The leading measure moved: answer pages now exist for q06 (mental health or addiction help today), q09 (business licenses), q14 (potholes), q27 (housing vouchers) and q41 (borrowing a drill), so 43 of 45 questions have one. q23 (crime trends) and q35 (community garden plots) are still open, and both pages say so plainly (#772 for crime).

## Top problems, most common first

1. **Missing links between related pages** (16 links). Pages a resident opens first did not link to the new pages: the heat bill page to After you apply for LIEAP, SNAP to its own after you apply guide, Protective orders and I'm leaving an unsafe home to each other, Turning 65 to the Medicare costs guide, Have your say to the agendas, Meet people to Find your people, Family Court to the divorce steps, and more. The After you apply hub listed 7 of its 12 guides. *Fixed:* #1250 (merged) and #1254 (waits for David).
2. **Search ranks group profile pages above guides, and the page lacks spelling fixes.** *Fixed in #1274* (waits for David). The bigger fix, one shared search code for the page and the test, is #1286.
3. **People's own words are not on the page.** "laid off", "speech delay", "seniors", "school board agenda", "pools", "spay and neuter". *Fixed in #1265* (merged). Words for high-stakes pages ("restraining order", "unemployment appeal", "disability denied") need David: #1289.
4. **Life event links sit 6 to 9 screens down the Family door.** None of the six is a choice in "Pick all that fit". Five new choices were tried (#1279) and measured: links rose to about 3 screens, but the score did not improve and another task got worse, because the longer list pushes everything else down. Closed, and filed as #1287 for a design choice.
5. **Link hubs give no number or checked date.** Filed as #1288.

## Limits

- Simulated. A script and Claude, not people. Real residents might pick other doors, type other words or give up sooner.
- Tap paths for the 20 new tasks are the ones we judged a resident would take, using the home page's own words. Some tasks have a second good answer the script does not count (Reentry for n08, Families and kids for n11, Family Court for "child custody"); notes say so.
- The script reads visible text, so checked dates inside closed sections do not count.
- We did not re-check facts against sources in this run, and the findability web searches were not rerun.

## PRs and issues from this run

- #1250 Links between related pages (merged)
- #1254 Links to after you apply guides and life event pages from high-stakes pages (waits for David)
- #1265 Also called words for eight pages (merged)
- #1274 Search page: spelling fixes, group pages after guides (waits for David)
- #1279 Family door choices for life events (closed after measuring; see problem 4)
- #1289 Also called words for six high-stakes pages: restraining order, hungry, heating bill and more (waits for David). Search test 214 to 218.
- #1286 One shared search code for the page and the search test
- #1287 Family door: life event pages sit 6 to 9 screens down on a phone
- #1288 Link hubs show no number or checked date
