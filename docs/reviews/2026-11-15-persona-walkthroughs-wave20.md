# Persona walkthroughs, wave 20: November 15, 2026

**Simulated, not real residents.** A script walked each of the 32 personas in `content/personas.yaml` on the built site at phone width (390 by 844), from the home page by tapping and through site search. Claude read the landing pages. Nothing here is resident feedback. Sprint wave 20, persona walkthroughs lane (see #529).

Results: [`content/findability/walkthroughs/2026-11-15-personas-wave20.yaml`](../../content/findability/walkthroughs/2026-11-15-personas-wave20.yaml). Tasks and scripts: [`content/findability/walkthroughs/`](../../content/findability/walkthroughs/) (`tasks-personas.yaml`, `walk.js`, `score.py`, unchanged except one new path for p31).

## Scores

Each task gets six scores from 0 to 3 (18 points), tied to rubric criteria: task success, steps, search, reading level, sources and dates, and a clear next step.

| Run | Build | Points | Score |
|---|---|---|---|
| Round 4 (November 3) | `main` then | 499 of 576 | 87% |
| Wave 20 before | `main` at 4d0a2dc | 508 of 576 | 88% |
| Wave 20 after | `main` plus #2001 and #2003 | 522 of 576 | 91% |

No dead ends in either run. Searches with the answer in the top 3: 54 of 64 before, 55 after.

## The three lowest, and what we changed

| Persona | Before | After | Why it scored low | Fix |
|---|---|---|---|---|
| p21 Just moved here: "When is trash pickup on my street?" | 9 | 16 | The New to Mon County page was a list of links with no phone and no checked date. The trash link said only "find your day". | #2001: the link now says we could not find a public list of pickup days by street, and shows the Solid Waste Authority phone and source line from its record. |
| p20 Remote worker: "Can I get fast internet?" | 10 | 16 | The remote workers page had no phone and no checked date, and its internet link went to the top of Internet at home. | #2001: Library Wi-Fi shows the library's phone and source line. The internet link goes straight to the state map of internet service. |
| p31 Helper: "Is there a list I can print for people I help?" | 10 | 11 | Three taps from home through a page about volunteering and giving. | #2003: Make a list for someone is now on the Your community door, two taps from home. |

Make a list keeps low source and next step scores by design: it is a tool, and each place shows its phone, source and checked date once picked. The script does not pick places.

## Next lowest

- **p12, help at home for a disability (13).** The wave 17 fix is the Family door PR #1904, still open for David. Wave 17 reported 104 of 126 for its door tasks; on `main` without #1904 they score 100.
- **p17 lost a job, p19 starting a business, p23 rural homeowner, p28 wants a say (15 each).** Long scrolls (8 to 12 screens) or one search that finds a different page that also answers. None is a dead end.

## Content we do not have

- **Pickup days by address.** We could not find an official page that lists trash pickup days by street (the `pickup-days` fact). Whether the Solid Waste Authority can tell a caller their day is open in #901. Research issue: #2009.
- **What internet reaches an address.** The FCC National Broadband Map was not read in #665 (blocked then), so Internet at home has only the state map. Research issue: #2010.

## Method notes

- Both runs used `walk.js --after`, so each task uses its current landing page. The only task change is a new `after_path` for p31 (home, Your community, Make a list). Its before run used the old three-tap path.
- The after build was `main` at f3e4341 plus both fix PRs. Only p20, p21 and p31 changed between the runs.
- Checked at 320px and 390px with 200% text, light and dark, on the changed pages: no sideways scroll.
- Cost: $0.
