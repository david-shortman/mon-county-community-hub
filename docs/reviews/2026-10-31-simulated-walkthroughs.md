# Simulated resident walkthroughs: 30 tasks on a phone

**Date:** October 31, 2026 (finished November 1). **Who:** Claude Code, sprint wave 6, "our own tests" lane (#529).

> **Simulated, not real residents.** These are made-up tasks that Claude walked with a script on the built site. They show where a stressed person on a phone might get stuck. They are not resident feedback, and nothing here says what real people do. Real feedback still has to come from residents (charter level 4).

## What we did

- **30 tasks** in a resident's own words, drawn from the resident groups (`docs/groups/`), the needs register (`content/needs/`) and the findability questions. Examples: "My power gets shut off Friday", "I just moved here and need a library card and to register to vote", "My mom is 70 and needs rides to dialysis", "I'm a WVU student and I can't afford groceries", "A storm flooded my basement last night". All 30 are in [`content/findability/walkthroughs/tasks.yaml`](../../content/findability/walkthroughs/tasks.yaml).
- **Two ways in for each task**, at 390 by 844 (a common phone): tapping from the home page the way a resident would (on door pages, ticking the matching choice and pressing "Show my steps"), and typing two phrases into the site search.
- **Recorded** taps, how far down each link sat, dead ends, where the answer starts, checked dates, source links, phone numbers and a rough reading grade, then read each answer for confusing words and missing next steps.
- **Scored** each task 0 to 3 on six rubric criteria: IA1 task success, IA2 steps, IA7 search ([information architecture](../rubrics/information-architecture.md)), PL1 reading level ([plain language](../rubrics/plain-language.md)), TR1 sources and dates ([trust](../rubrics/trust-and-civic-ethics.md)) and II1 clear next step ([interface](../rubrics/interface-and-interaction.md)). Rules are in [`score.py`](../../content/findability/walkthroughs/score.py).
- **Re-ran** all 30 on a local build with the fix PRs combined, for an after score.

Results with notes per task: [`content/findability/walkthroughs/2026-10-31.yaml`](../../content/findability/walkthroughs/2026-10-31.yaml).

## Summary

| | Before (main) | After (fix PRs, built together) |
|---|---|---|
| Score (all six criteria, 0 to 100) | 85 | 88 |
| Dead ends on the tap path | 2 | 0 |
| Searches with the answer in the top 3 | 42 of 60 | 50 of 60 |
| IA1 task success (average, 0 to 3) | 2.87 | 3.0 |
| IA2 steps | 1.47 | 1.57 |
| IA7 search | 2.27 | 2.67 |
| PL1 reading level | 2.67 | 2.67 |
| TR1 sources and dates | 2.97 | 2.97 |
| II1 clear next step | 3.0 | 3.0 |

The after column counts #1153, #1156, #1160 and #1163. #1171 (door choices) came after the run; on its branch, w20, w26 and w27 drop from 11 to 17 screens of scrolling to 1 to 3.

**What works well.** Every task has an answer on the site, and every answer page has a checked date, outside sources and a phone number or link to act on. Urgent tasks (shutoff, a bed tonight, eviction, a crisis) are one tap from the home page with the answer on the first screen. Most answer text reads at grade 6 or lower.

**What does not.** Steps (IA2) are the weak spot: 1.5 of 3 on average. The answers are there, but many sit at the bottom of long door pages. And before the search fix, search missed when people used their own words.

## Each task

Taps and screens are for the tap path before the fixes. "Search" is how many of the two phrases put the answer in the top 3.

| Task | What the resident says | Tap path before | Search, before → after | Score, before → after |
|---|---|---|---|---|
| w01 | My power gets shut off Friday and I can't pay. | 1 tap, 0 screens | 2 of 2 → 2 of 2 | 18 → 18 of 18 |
| w02 | I just moved here and need a library card and to register to vote. | 4 taps, 3 screens | 2 of 2 → 2 of 2 | 15 → 15 of 18 |
| w03 | My mom is 70 and needs rides to dialysis three times a week. | 4 taps, 4 screens | 1 of 2 → 1 of 2 | 15 → 15 of 18 |
| w04 | I'm a WVU student and I can't afford groceries. | 2 taps, 2 screens | 1 of 2 → 1 of 2 | 16 → 16 of 18 |
| w05 | A storm flooded my basement last night. | 4 taps, 2 screens | 2 of 2 → 2 of 2 | 16 → 16 of 18 |
| w06 | I have nowhere to sleep tonight and it's freezing. | 1 tap, 0 screens | 2 of 2 → 2 of 2 | 18 → 18 of 18 |
| w07 | I got an eviction notice taped to my door. | 1 tap, 1 screens | 2 of 2 → 2 of 2 | 18 → 18 of 18 |
| w08 | My kid needs shots before school starts. | 5 taps, 3 screens (dead end) | 2 of 2 → 2 of 2 | 13 → 15 of 18 |
| w09 | I have no insurance and my tooth is killing me. | 4 taps, 4 screens | 1 of 2 → 2 of 2 | 14 → 15 of 18 |
| w10 | My brother is using again. Where can he get treatment? | 1 tap, 1 screens | 0 of 2 → 2 of 2 | 15 → 18 of 18 |
| w11 | I feel like I can't go on. | 1 tap, 1 screens | 1 of 2 → 2 of 2 | 17 → 18 of 18 |
| w12 | I lost my job and need food stamps. | 3 taps, 3 screens | 2 of 2 → 2 of 2 | 17 → 17 of 18 |
| w13 | I need child care so I can go back to work. | 4 taps, 12 screens | 0 of 2 → 1 of 2 | 12 → 15 of 18 |
| w14 | I turn 65 in March. How do I sign up for Medicare? | 1 tap, 1 screens | 2 of 2 → 2 of 2 | 18 → 18 of 18 |
| w15 | I'm pregnant and don't have a doctor or insurance. | 4 taps, 4 screens | 2 of 2 → 2 of 2 | 16 → 16 of 18 |
| w16 | I moved from Pennsylvania. How do I get a West Virginia driver's license? | 4 taps, 2 screens | 2 of 2 → 2 of 2 | 15 → 15 of 18 |
| w17 | What day is my trash picked up? | 1 tap, 1 screens | 1 of 2 → 2 of 2 | 17 → 18 of 18 |
| w18 | Where do I get rid of old tires and a broken TV? | 4 taps, 2 screens | 2 of 2 → 2 of 2 | 16 → 16 of 18 |
| w19 | I'm a veteran and I could lose my apartment. | 1 tap, 5 screens | 2 of 2 → 2 of 2 | 16 → 16 of 18 |
| w20 | I care for my dad with dementia and I need a break. | 2 taps, 11 screens | 2 of 2 → 2 of 2 | 15 → 15 of 18 |
| w21 | I got a letter saying I have to renew my Medicaid. | 1 tap, 3 screens | 1 of 2 → 1 of 2 | 15 → 15 of 18 |
| w22 | I can't afford internet for my kid's homework. | 2 taps, 7 screens | 0 of 2 → 1 of 2 | 12 → 14 of 18 |
| w23 | I want to sell cookies and cakes I bake at home. | 2 taps, 9 screens | 0 of 2 → 0 of 2 | 13 → 14 of 18 |
| w24 | My landlord won't fix the heat. | 2 taps, 16 screens | 1 of 2 → 1 of 2 | 13 → 14 of 18 |
| w25 | I need a job but I don't have a car. | 3 taps, 3 screens (dead end) | 2 of 2 → 2 of 2 | 13 → 16 of 18 |
| w26 | I'm 68. Can I get a break on my property tax? | 2 taps, 17 screens | 1 of 2 → 2 of 2 | 13 → 14 of 18 |
| w27 | My dad just died. What do I do first? | 2 taps, 12 screens | 2 of 2 → 2 of 2 | 15 → 15 of 18 |
| w28 | I need free help doing my taxes. | 4 taps, 2 screens | 2 of 2 → 2 of 2 | 16 → 16 of 18 |
| w29 | I take the bus to work. Is there a cheaper bus pass? | 2 taps, 7 screens | 2 of 2 → 2 of 2 | 16 → 16 of 18 |
| w30 | I'm lonely since I retired and want to meet people. | 2 taps, 7 screens | 0 of 2 → 0 of 2 | 14 → 14 of 18 |

## Top problems, most common first

1. **Search missed people's own words** (18 of 60 phrases before). Pagefind only matched pages with every word, so "detox near me" found nothing, and words our pages do not use ("garbage", "rehab", "toothache", "daycare") missed. Printout and help-giver pages often ranked above the pages they copy. *Fixed in #1153*: ranks pages by how many of your words they have, maps common words, skips filler, lists printouts and helper pages last. 42 to 50 of 60 in the top 3.
2. **Answers at the bottom of long door pages** (10 tasks needed 7 or more screens of scrolling). Renting, Property tax and Free tax help sit 16 to 17 screens down Get through this month. Caregivers, When someone dies and Internet sit 6 to 12 screens down their door's topic list. *Partly fixed*: new door choices in #1156 (landlord repairs) and #1171 (caregiving, a death in the family, property tax). The page itself is #1174.
3. **Missing links between pages** (2 dead ends, 1 near miss). School-age kids did not link to the school shots page; Work and learning did not link to Find a job; Selling food did not link to the bake sale rules. *Fixed in #1156 and #1160.*
4. **Content we have but do not show.** A checked record for help finding and paying for child care (#735) appeared on no page, and the Family door had no child care choice. Child care is on the needs register. *Fixed in #1163* (waits for David, as #571 asks).
5. **Content we do not have.** Nothing covers selling food made at home (w23). *Filed as #1173.*
6. **Hard words and buried answers on three pages.** Internet at home leads with speed maps, not help paying; Caring for a family member uses "respite care" with no plain words; Keep your Medicaid in 2027 puts the renewal answer 3 screens down in quotes. *Filed as #1175.*

Smaller things noted in the results file: the Turning 65 and Pregnant pages use "WVCHIP" without saying what it is; the trash pickup answer is honestly "call", because no public map exists.

## Compared with the source benchmark (#184)

`content/findability/benchmark/measure.js --hub-only` ran against the live site on November 1. Compared with the October 30 run on our eight benchmark pages:

- **Reading grade went down (better) on most:** utility bills 9.3 to 7.6, food this week 9.4 to 7.3, dentist and prescriptions 12.2 to 7.7. SNAP stayed at 8.3.
- **Pages are heavier:** about 29 KB to 35 KB each. Still loads the answer in under a second on a slow phone connection.
- **Get through this month got longer:** on `/money/#rent`, words before the rent answer went from 909 to 1,407. This matches problem 2 (#1174).

The benchmark run was a check only; no new benchmark file was saved.

## Limits

- Simulated. A script and Claude, not people. Real residents might pick different doors, type different words, or give up sooner.
- Reading grades are rough (Flesch-Kincaid on about 150 words).
- The tap paths are the ones we judged a resident would take. A different path could be shorter or longer.
- Answers were judged for being current and sourced on the page (checked dates, links). We did not re-check the facts against the sources in this run.

## PRs and issues from this run

- #1153 Search finds pages in residents' own words (waits for David: the search page names 211)
- #1156 Links: school shots, bake sales, landlord repairs (labeled for David by the High stakes check while it still held the Work and learning change; that change moved to #1160)
- #1160 Work and learning links to Find a job (waits for David: the page names 211)
- #1163 Child care help on Families and kids and the Family door (waits for David)
- #1171 Door choices for caregiving, a death in the family, and property tax
- #1173 Selling food made at home: no page covers it
- #1174 Get through this month is 17 screens long
- #1175 Plain words: Internet at home, Caring for a family member, Keep your Medicaid in 2027
