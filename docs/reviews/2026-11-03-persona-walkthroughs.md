# Persona walkthroughs, round 3: does each persona's first page answer their question?

**Date:** November 3, 2026. **Who:** Claude Code, sprint wave 11, persona walkthroughs lane (#1533, see #529).

> **Simulated, not real residents.** A script and Claude walked each persona's question on the built site at phone width, with made-up search words. This shows where a person on a phone might get stuck. It is not resident feedback, and nothing here says what real people do. Real feedback still has to come from residents (charter level 4).

## What we did

- **One task per persona.** The 32 personas in [`content/personas.yaml`](../../content/personas.yaml) each have a findability question. Each task uses that question, the persona's own search words, one shorter phrase, and the persona's landing page. Tasks: [`tasks-personas.yaml`](../../content/findability/walkthroughs/tasks-personas.yaml) (p01 to p32).
- **Same scripts and rubric** as the earlier walkthroughs ([round 1](2026-10-31-simulated-walkthroughs.md), [round 2](2026-11-01-simulated-walkthroughs-rerun.md)): `walk.js` taps from the home page at 390 by 844 using the words on the home page and door pages, and runs both searches on the real `/search/` page; `score.py` gives six 0 to 3 scores.
- **Read every landing page** against the question, because the score only checks that a page is reached, not that it answers.
- **Fixed** the top problems in four small PRs, then measured again.

Results with a note on every task: [`2026-11-03-personas.yaml`](../../content/findability/walkthroughs/2026-11-03-personas.yaml).

## Summary

| | Before (main at start) | After (with this lane's fixes) |
|---|---|---|
| Score (0 to 100) | 86 | 87 |
| Landing page answers the question (Claude's read) | 24 of 32 | 29 of 32 |
| Searches with the answer in the top 3 (of 64) | 42 | 49 |
| Dead ends | 0 | 0 |
| Average taps | 1.8 | 1.9 |

"After" is main with #1540 and #1556 merged, plus #1564 and open PR #1570, built together. Five tasks use their new landing page.

**The score barely moved, but it was measuring the wrong pages.** Five personas landed on a page that never mentions what they asked about: no "WIC" on the page for parents of babies, no "unemployment" on Find a job, no "license" on Start or grow a business, no "internet" on Moving here, and a dentist page for someone who needs a doctor. The script still gave them high scores because it reached a page with phone numbers. Moving them to the right page fixed the answer but cost points elsewhere: the remote worker's new landing is a link hub, which shows no checked date or number of its own (the same pattern as #1288), so that task went from 16 to 10 of 18 even though the person now gets their answer.

**Search got better.** "Also called" words put the right page in the top 3 for seven more searches: a printable resource list, what's going on this week, landlord won't fix, sign up for WIC, file unemployment, business license and fast internet.

## Top problems, most common first

1. **Landing pages that do not answer the question** (5 personas: p07, p13, p17, p19, p20). *Fixed in #1540* (merged): no insurance now lands on `/no-insurance/`, WIC on `/pregnant-or-new-baby/`, unemployment on `/unemployment/`, the business license on `/start-a-business/` and the remote worker on `/for/remote-workers/`.
2. **Missing words in search** (8 personas). People's words were not on the page: "resource list", "printable", "this week", "how healthy", "fast internet", "business license", "remote work", "landlord won't fix", "WIC sign up". *Fixed in #1564* (merged) for 11 pages, and *#1570* (waits for David) for Renting and Pregnant or new baby.
3. **Missing links** (3 pages). The parents of babies page did not link WIC, Find a job did not link File for unemployment, and Moving here did not link Internet at home. *Fixed in #1556* (merged).
4. **The Family door buries work, reentry, business and disability pages** 6 to 10 screens down, and its pick list has no choice for four of them. Seven tasks score 1 of 3 on steps. Filed as #1571; it needs a design choice (see #1287 for why more choices alone did not help).
5. **Link hubs give no checked date or number.** Three personas still land on a hub (disability, new to Mon County, and now remote workers). Known from #1288.

## Still not answered well

- **Trash pickup day on my street (p21).** No official page lists pickup days by street. The site sends people to their town or hauler.
- **How healthy is Mon County compared to the state (p32).** The persona lands on This week, which is about events. The answer is on How we're doing, one of its next steps. Left as is, since the persona's search words ("what's going on this week") fit This week.
- **"medicare help morgantown wv" and "things to do in morgantown"** still rank Turning 65 6th and do not find Find your people, even with the new words. Search ranking is shared work on #1286.

## Limits

- Simulated. A script and Claude, not people. Real residents might pick other doors, type other words or give up sooner.
- Tap paths are the ones we judged a resident would take from the home page's own words. For p07 the after run uses the home page link "Can't afford a doctor or medicine", which goes straight to the new landing.
- "Landing page answers the question" is Claude's own reading, not a script check.
- The script reads visible text, so checked dates inside closed sections do not count.
- We did not re-check facts against sources in this run, and the findability web searches were not rerun.

## PRs and issues from this run

- #1540 Personas: five landing pages that answer the question better (merged)
- #1556 Links a persona walkthrough found missing: WIC, unemployment, internet (merged)
- #1564 Also called words for 11 pages (merged)
- #1570 Also called words for Renting and Pregnant or new baby (waits for David)
- #1571 Family door: work, reentry, business and disability pages sit 6 to 10 screens down on a phone
