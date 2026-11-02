# Scoreboard

How we know whether the project is helping. The [charter](CHARTER.md#how-we-measure) sets four levels, from what Claude can move by itself to what only the community can give us. Every run of the daily loop tries to move these numbers.

| Level | Status | Latest |
|---|---|---|
| 1. Findability | **Measured** | **76 / 100** on the original 32 questions, 2026-11-01 (weekly run; baseline also 76). All 62 questions: 71. Answer pages on our site: 59 of 62, none in search yet. |
| 2. Use | Not measured yet | A visit counter (GoatCounter) went live on 2026-11-01. Its counts are not public, so the weekly run cannot read them yet. |
| 3. Action | Not measured yet | None |
| 4. Recognition | Not measured yet | None |

## Level 1: Findability

### Weekly run: 76 on the original 32, 71 on all 62 questions (2026-11-01)

The first Sunday run, two days after the backlog sprint. Six testers ran all 62 questions with the same search words and rubric. Results: [`content/findability/2026-11-01.yaml`](../content/findability/2026-11-01.yaml), [build log](build-log/2026-11-02-0030-findability-weekly-2026-11-01.md).

- **No change on the questions we had before.** The original 32 stay at 76 and the 45 from last week stay at 71. Only one question moved: reporting a pothole (q14) went from 13 to 12 because the city's service request page now scrolls sideways on a phone. That is a change on another site, not ours.
- **17 new questions scored for the first time** (q46 to q62, one per resident persona, #1036). Together they score 71. Free tax help (q46) and food for WVU students (q53) score 15 of 15. A septic permit (q58) and a medical interpreter (q60) score 0: both searches showed only other counties' pages or job ads. WIC sign-up (q50) and help after prison (q55) score 9.
- **Leading measure: 59 of 62 questions now have an answer page on our site** (43 of the 45 from last week, up from 38; 31 of the original 32, up from 27). The five pages that were waiting in open PRs last week are live: mental health help today, a business license, potholes, housing vouchers and borrowing a tool. Still no page: crime trends (q23), community garden plots (q35) and filing for unemployment (q54; the page is planned in #790 and #1161).
- **Our pages are still not in search: 0 of 59.** So by the method they do not raise the score yet. Search engine setup waits on David (#89). This is still the main thing holding the score back.
- **Top 3 results with a correct local answer:** 5 of the original 32 (same as last week), 13 of all 62.
- **Pages that fail:** the city's waste, recycling guide and open board seats pages and the utility's hazardous waste page still return 404 while ranking in the top 3. The school district's results article (q22) still returns 404. The city's old public comment sign-up form (q12) now returns 404.

The topic, dimension and worst-gap tables below are from this 2026-11-01 run.

### Answer-page recheck: 38 of 45 questions answered on our site (2026-10-31b)

Sprint wave 3 (#529) built answer pages for questions the site could not answer yet, then rechecked them. Results: [`content/findability/2026-10-31b.yaml`](../content/findability/2026-10-31b.yaml), [build log](build-log/2026-10-31-1800-findability-answer-recheck.md).

- **On our site: 38 of 45 questions now have an answer page, up from 33.** On the original 32 it is 27, up from 24. New: volunteering this weekend (q16, [/volunteer/](https://everythingmorgantown.org/volunteer/)), school test scores (q22, [/how-we-are-doing/#schools](https://everythingmorgantown.org/how-we-are-doing/#schools)), soil tests (q33, [/soil-test/](https://everythingmorgantown.org/soil-test/)) and plant problems (q34, [/plant-problems/](https://everythingmorgantown.org/plant-problems/)). The next election and ballot (q32) was answered on [/vote/](https://everythingmorgantown.org/vote/) by #970 after the end-of-sprint run.
- **In search: still 0 of 38.** We ran the plain search again for the five newly answered questions. None of our pages showed up, so the scores do not change: 76 on the original 32 and 71 on all 45. Search indexing waits on David's decision in #89.
- **Answered in an open PR, waiting for David:** mental health help today (q06, #687), a business license (q09, #817), potholes (q14, #550), housing vouchers (q27, #832) and borrowing a tool (q41, #741).
- **Still no answer:** crime trends (q23; crime numbers are open on #772) and community garden plots (q35; no official page found, leads on #438).

### Latest run: 76 out of 100 on the original 32 questions (2026-10-31, end of sprint)

A recheck after the October 30 to 31 backlog sprint (#529), when the site had grown from about 30 pages to about 118. Results: [`content/findability/2026-10-31.yaml`](../content/findability/2026-10-31.yaml), [build log](build-log/2026-10-31-0300-findability-end-of-sprint.md).

- **The score did not move: 76, the same as the baseline.** 27 of the original 32 questions scored the same. Five moved by a point or two, and none because of our site: q01 heating help (+1) and q03 water shutoff help (+2) because testers found a "last updated" date and a better reworded search, q13 council member (+1) because the city's ward pages now agree, q09 business license (-1) and q12 speaking at council (-1) from search ranking and a city page that now scrolls sideways on a phone. Treat moves this size as noise.
- **Leading measure: 24 of 32 questions now have an answer page on our site, up from 6.** With the 13 questions added during the sprint, it is 33 of 45.
- **Our pages are still not in search: 0 of 33.** The method only counts our page once it shows up in a resident's search (or an official page links to it), so the sprint's pages cannot raise the score until search engines index the new domain. The site has no search engine accounts yet; that is David's decision (#89). This is the main thing holding the score back.
- **Top 3 results with a correct local answer:** 5 of 32 (was 6; q09 slipped to fourth).
- **The 13 newer questions** (growing, secondhand, community centers) score 57 out of 100 together. Renting a hall (q44) and a community dinner this weekend (q45) still score 0: search shows nothing usable, while our community centers pages answer both. Garden plots (q35), free seeds (q36), thrift stores (q38) and flea markets (q39) score 8. Two of those scores (q38, q39) came from search snippets because the best pages refused every tool; the notes say so.

**Score by topic, all 45 questions** (0 to 100, lowest first): community centers 27, recycling 60, growing 65, secondhand 67, transportation 70, local government 73, community health data 73, small business 76, philanthropy and volunteering 76, housing 80, civic participation 82, help with bills and food 83, medical care 83. Dimensions on the original 32 (average out of 3): found 2.0, steps 2.5, current 2.3, plain 2.0, works on a phone 2.7.

**Questions with no page of ours yet:** mental health help today (q06), a business license (q09), potholes (q14), volunteering this weekend (q16), school test scores (q22), crime trends (q23), housing vouchers (q27), the next election and ballot (q32), soil tests (q33), plant problems (q34), garden plots (q35), and borrowing a tool (q41; the MOTO tool library is in our data but not on the sell or donate page).

### Same-day recheck: 76 out of 100 (2026-10-28)

A second run a few hours after the baseline, after the first three hub guides went live (recycling, help paying utility bills, where to stay tonight). Results: [`content/findability/2026-10-28b.yaml`](../content/findability/2026-10-28b.yaml).

- **No change overall.** 30 of 32 questions scored the same. Two moved, in opposite directions, and both came from other sites or search ranking, not from our work: starting a business (q09) rose 11 to 13 because the city's steps page now ranks first and fits a phone screen, and county commission agendas (q15) fell 11 to 9 because search no longer reached the county's agenda page. The q15 drop looks like search variation; the official page still loads and is current.
- **Our pages are not in search yet.** 6 of 32 questions now have a direct answer page on the site (q01, q03, q19, q20, q21, q26). None of them showed up in any search, and no official page links to them, so by the method they do not count yet. New pages usually take days to weeks to be indexed, and the site has no search engine accounts yet (#89). The next weekly run (2026-11-01) will check again.
- **Leading signal:** 6 of 32 questions had a correct local answer in the top 3 search results (5 at baseline, the change is q09).

The baseline write-up follows the tables below.

### Baseline: 76 out of 100 (2026-10-28, first run)

We asked 32 questions a Mon County resident might have, across 10 topic areas. For each one we searched the web in plain words, followed links like a person on a phone, and scored the best answer we could reach.

- Questions: [`content/findability/questions.yaml`](../content/findability/questions.yaml)
- Results, with the best URL and a note for every question: [`content/findability/2026-10-28.yaml`](../content/findability/2026-10-28.yaml)

**What the number means.** 76 does not mean things are mostly fine. It scores the *best* answer a determined person could reach, often after rewording a search or digging through a site. The weakest part is the first step: only 5 of 32 questions had a correct local answer in the top 3 search results. In 6 questions, a plain search did not lead to a usable local answer at all.

**Score by topic, original 32 questions** (latest run, 2026-11-01, 0 to 100, lowest first; at baseline local government was 77, small business 73 and help with bills and food 78):

| Topic | Score | Questions |
|---|---|---|
| Recycling and disposal | 60 | 3 |
| Transportation | 70 | 2 |
| Local government | 72 | 4 |
| Community health data | 73 | 3 |
| Philanthropy and volunteering | 76 | 3 |
| Small business | 76 | 3 |
| Housing | 80 | 3 |
| Civic participation | 82 | 3 |
| Help with bills and food | 83 | 4 |
| Medical care | 83 | 4 |

All 62 questions by topic (2026-11-01, lowest first): language 0 (1 question), community centers 27, recycling 60, growing 65, housing 65, secondhand 67, safety 67, veterans 67, helping others 67, transportation 70, local government 72, community health data 73, small business 76, philanthropy and volunteering 76, work 76, family 77, civic participation 82, aging 83, medical care 83, help with bills and food 89, moving here 93. Topics with one or two questions move a lot from a single score.

**Score by dimension** (latest run, original 32, average out of 3): found 2.0, steps 2.5, current 2.3, plain language 2.0, works on a phone 2.6. At baseline plain language was 2.1 and works on a phone 2.7. All 62: found 1.9, steps 2.4, current 2.0, plain 2.0, phone 2.4.

**Patterns we saw:**

- **Search sends people the wrong way.** Top results were often paid directories, out-of-state places with similar names (Mono County CA, Morganton NC, Mountain Line in Montana), old news stories, or AI meeting summaries, ahead of the local office or nonprofit that actually helps.
- **Dead links on official sites.** 7 questions hit a page that no longer exists (404 or 410), including the city's recycling guide and waste page, the city's open board seats page, and a utility hazardous waste page.
- **Answers locked in PDFs.** 11 questions had their key detail (forms, fees, bus times, sample ballots, glass rules) only in a PDF.
- **No dates.** Many good pages carry no "last updated" date, so a resident cannot tell if they are current.
- **Phones mostly work.** Most pages fit a phone screen. The misses were PDFs and a few fixed-width or wide pages.

### The 5 worst gaps (latest run, all 62 questions)

| Question | Score | What is missing |
|---|---|---|
| Where can I rent a hall for a party, and what does it cost? (q44) | 0 / 15 | Search shows apartment listings and old photos. Our [halls page](https://everythingmorgantown.org/community-centers/halls/) answers it but is not in search. |
| Is there a community dinner this weekend? (q45) | 0 / 15 | No dinner listed for this weekend anywhere search reaches. Our [community centers page](https://everythingmorgantown.org/community-centers/) is not in search. |
| How do I get a permit for a new septic system? (q58) | 0 / 15 | New. Both searches return other states' Montgomery and Monroe counties. Our [septic and wells page](https://everythingmorgantown.org/septic-and-wells/) is not in search. |
| Where can I get an interpreter for a doctor visit? (q60) | 0 / 15 | New. Only interpreter job ads and out-of-state hospitals. Whether local interpreters are free is open in #1194, #1323 and #1325. |
| When is trash and recycling pickup on my street? (q19) | 8 / 15 | No pickup-day map or street list loads, and the city's trash page link is dead. Residents have to call the hauler. |

Also at 8: glass in recycling (q21, see #25), garden plots (q35), free seeds (q36), thrift stores (q38) and flea markets (q39). At 9: county commission agendas (q15), crime trends (q23), bus to the hospital (q28), sign up for WIC (q50, the top result is an old desktop-only state page whose hours conflict with the state's clinic list) and help after prison (q55, only a 2023 federal page; see #215, #1228).

Our site has an answer page for 59 of 62 questions, including every one above except q23 and q35, but none of our pages show up in search yet, so these scores do not change.

### The 5 best-served areas

| Question | Score | Why it works |
|---|---|---|
| I'm being evicted. Where can I get free legal help? (q25) | 13 / 15 | Legal Aid of West Virginia has a plain page with forms, videos and a helpline. |
| How do I register to vote, and where is my polling place? (q30) | 13 / 15 | The city's voter page is the top result and links to state registration and polling places. |
| How do I report a pothole or broken streetlight? (q14) | 13 / 15 | The city's service request page clearly points to Morgantown 311. |
| I have no insurance. Where can I see a doctor? (q05) | 13 / 15 | Every top result points to Milan Puskar Health Right, whose site says who qualifies and how to come in. |
| I need a dentist but have no dental insurance. (q08) | 13 / 15 | The Health Department's dental clinic page says plainly it takes Medicaid and what it costs without insurance. |

Eleven questions tied at 13. These five were picked to show a spread of topics. Medical care is the best-served topic overall.

### Ideas filed from this baseline

Each worst gap became a scored idea issue (people helped, amplifies existing work, effort, risk; max 12). Duet ranks the queue.

| Issue | Idea | Score | For |
|---|---|---|---|
| #58 | Trash, recycling and drop-off guide | 11 | code |
| #64 | One page for help paying utility bills | 11 | code |
| #60 | Food pantry finder with days and hours | 10 | duet |
| #63 | Where to donate what | 10 | duet |
| #59 | Where to stay tonight | 9 | duet |
| #61 | Phone-friendly bus times to key places | 9 | code |
| #62 | "How are we doing" pages for crime, health, schools | 8 | code |

### Method (rubric v1)

**Testing a question.**

1. Search the web using the exact `search` words in `questions.yaml`. Note the domains of the top 3 results.
2. Follow results the way a person on a phone would. If the first search fails, try one reworded search. Find the best correct, local, actionable answer.
3. Load the best answer at 390px wide (an iPhone-sized screen) with `node content/findability/mobile-check.js <url>`. It reports whether the page is set up for phones, whether it scrolls sideways, and the latest year mentioned. Some sites block automated browsers. Then check by hand and say so in the note.
4. Score it, and record the best URL, the date checked, and a one-line note.

**Scoring.** Five dimensions, 0 to 3 each, 15 points per question.

| Points | Found | Steps | Current | Plain language | Works on a phone |
|---|---|---|---|---|---|
| 3 | Correct local answer in the top 3 results of the first search | Answer is on the page the result opens (0 to 1 taps) | Dated this year, shows this season's info, or clearly maintained | Short plain sentences and a clear next step | Fits the screen, readable, answer is a web page |
| 2 | Found, but lower in results or after one reworded search | 2 to 3 taps | Dated last year, or undated with no sign of staleness | Mostly plain, some jargon, next step findable | Small problems: some sideways scroll, crowded menus, popups |
| 1 | Only partial, generic (state or national), or conflicting | 4 or more taps, or you must call to learn the answer | Two or more years old, or some broken links or old details | Dense, bureaucratic, or buried in a PDF | Desktop-only layout, or the answer is a PDF or image |
| 0 | Not found, or wrong (then every other dimension is 0) | Could not reach it | Clearly out of date or dead | Hard to understand, no next step | Does not load or cannot be used |

A topic score and the overall score are the points earned divided by the points possible, on a 0 to 100 scale. Each question counts equally.

**Limits of this baseline.** Search results change by day and by person, and our search tool is not the same as Google on a resident's phone. One run was done by four Claude testers working in parallel with the same rubric, so some scoring judgment varies. Treat a change of a few points as noise. A change in a topic score, or a question moving from "not found" to "found", is a real signal.

### How to rerun

1. Copy the latest results file to `content/findability/<today>.yaml` and update `date`.
2. For each question, repeat the four testing steps above with the same `search` words, and overwrite the scores, URL, note and `checked` date.
3. Run `python3 content/findability/score.py content/findability/<today>.yaml` to get the overall, topic and dimension scores and the leading measure.
4. Add a row to the history table below and a short line in the build log on what moved and why. Include the leading measure from step 3.
5. If a build log file promised a check for this date, add a "Checked YYYY-MM-DD:" line to that file with what you found.

Rules for keeping runs comparable: keep question ids and `search` words fixed. Add new questions with new ids rather than rewording old ones. Retire a question by adding `retired: <date>`, not by deleting it. If the rubric changes, bump `rubric_version` and note it in the history table, because scores across versions are not directly comparable.

**Our own pages and the leading measure (#110).** Every result also records two fields. They keep the name `hub_page` from before the site was renamed, so old and new runs line up.

- `hub_page`: the page on our site that directly answers the question (its URL, on https://everythingmorgantown.org), or `null` if there is none. "Directly answers" means a resident who lands on it gets the answer or the next step for that exact question, not just a link list. To fill it, check the site's pages (`site/src/pages/`) and the menu, and carry forward last run's value if the page still answers it.
- `hub_in_results`: `true` if one of our pages showed up in the plain or the reworded search, else `false`. Our page counts toward the score only when this is `true`, or when an official page links to it.

`score.py` prints the **leading measure**: how many of the questions have an answer page on our site, and how many of those pages showed up in search. It warns when a `hub_page` has no matching page in `site/src/pages/` (a renamed or removed page). Report both numbers in the history table and the build log line.

### History

| Date | Overall | Questions | Rubric | Notes |
|---|---|---|---|---|
| 2026-10-28 | 76 | 32 | v1 | Baseline, before the hub published any guides |
| 2026-10-28 | 76 | 32 | v1 | Same-day recheck after the first guides shipped (recycling, utility bills, stay tonight). No change overall. Movers, both from other sites or search: q09 business license +2 (city page now ranks first and fits a phone), q15 county agendas -2 (search missed the agenda page). Hub answer pages: 6 of 32 questions; in search results: 0 (not indexed yet). Top-3 correct answers: 6 of 32 (was 5). [Results](../content/findability/2026-10-28b.yaml), [build log](build-log/2026-10-28-0647-findability-same-day-recheck.md) |
| 2026-10-30 | 27 (3 new questions only) | 3 | v1 | Starting score for the community centers questions q43 to q45 (#460), taken the day the section went live and before search engines indexed it. Not comparable to the full-set overall. Found a center: partial (one center on WVU's volunteer site). Rent a hall and a dinner this weekend: not found. Our answer pages: 3 of 3; in search results: 0. [Results](../content/findability/2026-10-30-centers.yaml) |
| 2026-10-31 | 76 (32 questions); 71 (all 45) | 45 | v1 | End-of-sprint recheck after the site grew to about 118 pages. No change on the original 32: five questions moved a point or two, all from other sites, search ranking or tester judgment. Our answer pages: 24 of 32 (was 6), 33 of 45; in search results: 0 (not indexed yet, #89). Top-3 correct answers: 5 of 32. First scores for q33 to q42. [Results](../content/findability/2026-10-31.yaml), [build log](build-log/2026-10-31-0300-findability-end-of-sprint.md) |
| 2026-11-01 | 76 (32 questions); 71 (all 45); 71 (all 62) | 62 | v1 | Weekly run, first Sunday. No change on the original 32 or the 45 from last week. One mover, from another site: q14 pothole -1 (city service request page now scrolls sideways on a phone). First scores for q46 to q62 (71 together); q58 septic permit and q60 interpreter score 0. Our answer pages: 59 of 62 (43 of 45, was 38; 31 of 32, was 27), all five pending PRs now merged; in search results: 0 (not indexed yet, #89). Top-3 correct answers: 5 of 32, 13 of 62. [Results](../content/findability/2026-11-01.yaml), [build log](build-log/2026-11-02-0030-findability-weekly-2026-11-01.md) |

### Source benchmark

The findability check asks whether a resident can find an answer by searching. The source benchmark asks a second question: **once a resident has a source open, how fast and how completely does it answer them?** It compares our page with the sources residents are handed today, for a few urgent needs (#183, #184). It compares formats, not organizations. These sources are where much of our information comes from.

- Tasks: [`content/findability/benchmark/tasks.yaml`](../content/findability/benchmark/tasks.yaml) (needs, sources, and the text that marks each answer)
- Runs: `content/findability/benchmark/YYYY-MM-DD.yaml`
- Tools: `measure.js` (automatic measures) and `score.py` (tables and the summary), in the same folder

**Sources compared for each need.**

| Name | What it is |
|---|---|
| `ours` | Our page that answers the need (the same page as `hub_page` in the latest findability run) |
| `frn-guide` | The United Way Family Resource Network's 2025 Monongalia County Resource Guide, an 11 page PDF (cover: "Updated February 2025") |
| `city-pathways` | The City of Morgantown's Community Resources page, then its "PATHWAYS to Help" link (1 tap) |
| `official` | The best official answer from the latest findability run (`best_url`) |

**Needs (findability ids):** q01 heating bill help, q02 food pantry this week, q03 water shutoff help, q04 apply for SNAP, q05 a doctor without insurance, q08 a dentist without dental insurance, q25 free legal help for an eviction, q26 a place to stay tonight.

**Measures.** `measure.js` takes the automatic ones. A person or agent scores the rest by reading the source.

| Measure | How it is scored | Who |
|---|---|---|
| Covered | Does the source address this need at all? `yes`, `partial`, or `no`. "Not covered" is an honest result. | Judgment |
| Taps | Taps from opening the source to the answer. For a PDF, the page number the answer is on. | Judgment, PDF page by script |
| Words before the answer | Words a reader passes before the answer text starts. A stand-in for clutter. | Script |
| Weight | Kilobytes downloaded at 390px on a slow 4G profile (150 ms, 1.6 Mbps). Budget for urgent pages: 100 KB (#180). | Script |
| Works on a phone | Sideways scroll, or a PDF that does not fit the screen | Script |
| Reading grade | Flesch-Kincaid grade of about 120 words from the answer on. Target: about 8. | Script |
| Answer card | 1 point each, 8 in all: days and hours; can you tell if it is open today; who qualifies; what to bring; address or how to apply; a next step that is not only a call; a checked or updated date; a link to the provider's own page. | Judgment |
| Must call to learn | Is a phone call the only way to learn the key fact (hours for a place, how to apply for a program)? | Judgment |
| Correct today | Two facts per need checked against the provider's own page, with the URL and date. Never guess. | Judgment |

**The "dramatically better" bar, written before the first run (2026-10-30).** For an urgent need, our page meets the bar when: the answer is on the page or one tap in, the page is under 100 KB, the answer card scores 7 of 8 or better, no phone call is needed to learn the key fact, and every checked fact is confirmed. Our page **beats** a source when the source does not cover the need, or when ours has more answer card points, has no fact found wrong where the source has none, and does not need a call that a source fully covering the need does not. A source we could not read this run is marked "not scored" and left out, never guessed. If a source beats us on anything, that becomes an `idea` issue. Do not loosen the bar after a run; if it must change, add a dated line here with the reason.

**How the weekly run does it.** The Sunday findability check runs the source benchmark after the findability questions (David's choice, #185). The Monday retro reports one line from it: how many needs our page answers better than every source, and which needs still need a phone call to learn the key fact.

1. Copy the newest run file to `content/findability/benchmark/<today>.yaml` and set `date`.
2. **Our pages, every week:** in `site/`, run `node ../content/findability/benchmark/measure.js --hub-only`. Copy each line's numbers into that source's `auto:`. Re-read each of our pages and update its answer card, `must_call`, and `facts` (check two facts against the provider's page). If our page for a need changed, update `tasks.yaml` and the findability `hub_page` together.
3. **Outside sources, first Sunday of the month only,** or sooner if the PDF's `sha256`, `last_modified` or `kb` changed: run `measure.js` with no options, and re-score the guide, city and official sources the same way. Otherwise carry their scores forward and leave their `checked` dates as they were.
4. Sites that block automated browsers (the city site, WV PATH) are scored by reading the page with a fetch tool. Write `blocked: true` and say "checked by hand" in the note. Never guess a number.
5. Run `python3 content/findability/benchmark/score.py content/findability/benchmark/<today>.yaml`. Put its summary line in the results table below and in the build log entry.
6. Open an `idea` issue for any need where a source beats our page, unless one is already open.
7. Never commit the PDF itself. Store only its URL, size, date and hash. Compare formats, not organizations: "a PDF list makes you call to learn the hours", never "the guide is bad".

**Results**

| Date | Beats every source | Meets the bar | Must call to learn (ours) | Notes |
|---|---|---|---|---|
| 2026-10-30 | 7 of 8 | 1 of 8 (q26 stay tonight) | q03 water shutoff (the utility does not publish payment plans) | First run. [Run file](../content/findability/benchmark/2026-10-30.yaml), [build log](build-log/2026-10-31-0100-source-benchmark.md). Three WVU pages refused our tools after the automatic check, so they were not scored. |

**First run, in plain words (2026-10-30).** Our pages beat every source on 7 of the 8 needs: they are about 30 KB against 300 KB to 5 MB for the other sources, the answer is on the page that opens for 6 of 8 needs, and they score 6 to 8 of 8 on the answer card against 1 to 6 for the others. The printed guide touches 7 of 8 needs (3 only in part) but gives names and phone numbers only, so for pantries, the clinic and the shelter you must call to learn the hours. Only one of our pages (where to stay tonight) clears the full bar. What holds the rest back:

- **Food this week (q02):** two taps in, and one provider instead of a list of pantries with days and hours. The city's PATHWAYS page lists pantry days for St. Ursula's and hours for Scott's Run.
- **A doctor without insurance (q05):** no page of our own; the free clinic sits on the dentist and medicine page. Ties the city's page, does not beat it. A page is planned in the Get care door (`/no-insurance/`).
- **Eviction help (q25):** the full Legal Aid card is two taps in on the Get through this month page. A link to its `#rent` section lands on a short paragraph with phone numbers only.
- **Water shutoff (q03):** the utility's site does not describe payment plans, so the key fact still needs a call.
- **What to bring** is missing on almost every source, ours included. Listing cards started showing it on 2026-10-30 (#159).
- **Plain language:** the dentist and medicine page opens at about grade 12.

### Reach: in-person listings by area

About 72% of residents live outside Morgantown city limits ([who lives here](playbook/audience-facts.md)). This counts where our in-person listings are, so the rural gap shows and can move (#834, from the [reach check](visibility/2026-10-31-reach-check.md)). It counts our listings, not people. Rerun it with each findability run: `python3 content/findability/reach.py`.

| Date | In-person listings | Morgantown | Rest of the county | Outside the county | Resources with an address |
|---|---|---|---|---|---|
| 2026-10-31 | 80 | 59 (74%) | 18 (22%) | 3 | 37 of 127, 30 of them in Morgantown |
| 2026-11-01 | 194 | 151 (78%) | 31 (16%) | 12 | 107 of 392, 86 of them in Morgantown |

"Morgantown" here means a Morgantown mailing address, which also covers some close-in places outside city limits, so the share is not directly comparable to the 72%. Most of the rest-of-county listings are community centers and halls (11 of 18). On 2026-11-01 the count more than doubled, mostly in Morgantown, so the rest-of-county share fell from 22% to 16% even though the number of rest-of-county listings grew from 18 to 31 (19 of them community places). Westover has the most outside Morgantown (7).

## Level 2: Use (not measured yet)

Whether people use what we build. To be measured as aggregate counts only, with no tracking of individuals: page views per guide, calendar feed subscriptions, tool uses, searches on the site, and API or MCP calls. David chose GoatCounter and the cookie-free visit counter went live on 2026-11-01 (#1352). Its dashboard needs a login and has no public view, so the weekly run cannot read the counts yet, and it has under a day of data. Until there is a way to read them without handling a login: not measured yet.

## Level 3: Action (not measured yet)

Whether it led people to do something: volunteer sign-ups, voter registrations, program applications, event turnout, donations to local groups. To be measured through tagged outbound links (counted in aggregate) and numbers partner organizations choose to report. Asking partners is David's job. Until then: none. Link tags and the small-count rule are in [`docs/measurement-plans/`](measurement-plans/README.md#shared-counting-rules).

## Level 4: Recognition (not measured yet)

Whether the community says it helped: resident feedback, corrections and suggestions submitted, a local group linking to or using the work, news coverage. To be measured by logging each instance here with a date and a public link where one exists (never private individuals' names). Until then: none.
