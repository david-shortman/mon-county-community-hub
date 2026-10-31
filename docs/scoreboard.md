# Scoreboard

How we know whether the project is helping. The [charter](CHARTER.md#how-we-measure) sets four levels, from what Claude can move by itself to what only the community can give us. Every run of the daily loop tries to move these numbers.

| Level | Status | Latest |
|---|---|---|
| 1. Findability | **Measured** | **76 / 100** on 2026-10-28 (same-day recheck; baseline also 76) |
| 2. Use | Not measured yet | No public tools to count yet |
| 3. Action | Not measured yet | None |
| 4. Recognition | Not measured yet | None |

## Level 1: Findability

### Latest run: 76 out of 100 (2026-10-28, same-day recheck)

A second run a few hours after the baseline, after the first three hub guides went live (recycling, help paying utility bills, where to stay tonight). Results: [`content/findability/2026-10-28b.yaml`](../content/findability/2026-10-28b.yaml).

- **No change overall.** 30 of 32 questions scored the same. Two moved, in opposite directions, and both came from other sites or search ranking, not from our work: starting a business (q09) rose 11 to 13 because the city's steps page now ranks first and fits a phone screen, and county commission agendas (q15) fell 11 to 9 because search no longer reached the county's agenda page. The q15 drop looks like search variation; the official page still loads and is current.
- **Our pages are not in search yet.** 6 of 32 questions now have a direct answer page on the site (q01, q03, q19, q20, q21, q26). None of them showed up in any search, and no official page links to them, so by the method they do not count yet. New pages usually take days to weeks to be indexed, and the site has no search engine accounts yet (#89). The next weekly run (2026-11-01) will check again.
- **Leading signal:** 6 of 32 questions had a correct local answer in the top 3 search results (5 at baseline, the change is q09).

The topic, dimension and worst-gap tables below show this latest run. The baseline write-up follows them.

### Baseline: 76 out of 100 (2026-10-28, first run)

We asked 32 questions a Mon County resident might have, across 10 topic areas. For each one we searched the web in plain words, followed links like a person on a phone, and scored the best answer we could reach.

- Questions: [`content/findability/questions.yaml`](../content/findability/questions.yaml)
- Results, with the best URL and a note for every question: [`content/findability/2026-10-28.yaml`](../content/findability/2026-10-28.yaml)

**What the number means.** 76 does not mean things are mostly fine. It scores the *best* answer a determined person could reach, often after rewording a search or digging through a site. The weakest part is the first step: only 5 of 32 questions had a correct local answer in the top 3 search results. In 6 questions, a plain search did not lead to a usable local answer at all.

**Score by topic** (latest run, 0 to 100, lowest first; at baseline local government was 77 and small business 73):

| Topic | Score | Questions |
|---|---|---|
| Recycling and disposal | 60 | 3 |
| Transportation | 70 | 2 |
| Local government | 73 | 4 |
| Community health data | 73 | 3 |
| Philanthropy and volunteering | 76 | 3 |
| Help with bills and food | 78 | 4 |
| Small business | 78 | 3 |
| Housing | 80 | 3 |
| Civic participation | 82 | 3 |
| Medical care | 83 | 4 |

**Score by dimension** (latest run, average out of 3): found 2.0, steps 2.5, current 2.2, plain language 2.0, works on a phone 2.7. At baseline plain language was 2.1.

**Patterns we saw:**

- **Search sends people the wrong way.** Top results were often paid directories, out-of-state places with similar names (Mono County CA, Morganton NC, Mountain Line in Montana), old news stories, or AI meeting summaries, ahead of the local office or nonprofit that actually helps.
- **Dead links on official sites.** 7 questions hit a page that no longer exists (404 or 410), including the city's recycling guide and waste page, the city's open board seats page, and a utility hazardous waste page.
- **Answers locked in PDFs.** 11 questions had their key detail (forms, fees, bus times, sample ballots, glass rules) only in a PDF.
- **No dates.** Many good pages carry no "last updated" date, so a resident cannot tell if they are current.
- **Phones mostly work.** Most pages fit a phone screen. The misses were PDFs and a few fixed-width or wide pages.

### The 5 worst gaps (latest run)

| Question | Score | What is missing |
|---|---|---|
| When is trash and recycling pickup on my street? (q19) | 8 / 15 | No pickup-day map or street list loads, and the city's trash page link is dead. Residents have to call the hauler. |
| Can I put glass in my recycling bin? (q21) | 8 / 15 | The only clear rule is in a 2019 PDF. No current page confirms it. See #25. |
| When does the County Commission meet, and where are the agendas? (q15) | 9 / 15 | New this run. Search led only to the County Clerk's draft minutes PDF, not the county's current agenda page. Likely search variation. Related research: #20. |
| Is crime going up or down in Morgantown? (q23) | 9 / 15 | No official crime trend page. The only trend data found is third-party and ends in 2018. |
| Which bus gets me to the hospital, and when? (q28) | 9 / 15 | Stop times are only in a PDF marked "Effective August, 2021". |

Also at 10: where to stay tonight (q26, search still shows only news stories; the hub's [stay tonight page](https://david-shortman.github.io/mon-county-community-hub/stay-tonight/) answers it but is not in search yet), selling food at a market or event (q11, everything is in PDFs) and donating furniture or clothes (q18, no list of who takes what).

The hub now has answer pages for q19, q21 and q26 ([recycling](https://david-shortman.github.io/mon-county-community-hub/recycling/), [stay tonight](https://david-shortman.github.io/mon-county-community-hub/stay-tonight/)), but a resident cannot find them by searching yet, so these scores do not change.

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

"Morgantown" here means a Morgantown mailing address, which also covers some close-in places outside city limits, so the share is not directly comparable to the 72%. Most of the rest-of-county listings are community centers and halls (11 of 18).

## Level 2: Use (not measured yet)

Whether people use what we build. To be measured as aggregate counts only, with no tracking of individuals: page views per guide, calendar feed subscriptions, tool uses, searches on the site, and API or MCP calls. This needs a privacy-respecting analytics choice first, which is a `for:david` decision because it may involve an outside service. Until then: none.

## Level 3: Action (not measured yet)

Whether it led people to do something: volunteer sign-ups, voter registrations, program applications, event turnout, donations to local groups. To be measured through tagged outbound links (counted in aggregate) and numbers partner organizations choose to report. Asking partners is David's job. Until then: none. Link tags and the small-count rule are in [`docs/measurement-plans/`](measurement-plans/README.md#shared-counting-rules).

## Level 4: Recognition (not measured yet)

Whether the community says it helped: resident feedback, corrections and suggestions submitted, a local group linking to or using the work, news coverage. To be measured by logging each instance here with a date and a public link where one exists (never private individuals' names). Until then: none.
