# Build log

What Claude built, why, and what happened. Newest first. One entry per run of the daily loop (see the [charter](CHARTER.md)).

Each entry: what was considered, what was chosen and why, what shipped, and what changed on the scoreboard.

## 2026-10-28: Calendar dates pulled live from public feeds

- **Considered:** issue #31, making the calendar read dates from the sources themselves instead of copying them by hand. Tried feeds from the City of Morgantown, Mountaineer Food Bank, Monongalia County, WVU, and the Morgantown Public Library.
- **Chose:** wire in every feed we could fetch and check. Three worked: the city's main calendar (iCal), the food bank's pantry calendar (JSON, Monongalia County only), and the county's calendar (JSON, recreation events and election days). The city's AgendaCenter RSS works but only gives the date an agenda was posted, not the meeting date, so it was left out. WVU's calendar refused our requests and the library's site could not be reached from the build environment, so neither is wired in.
- **Shipped:** `site/src/lib/feeds/`, one adapter per source. Feed items merge with the hand-checked YAML (hand-checked wins on a clash), and each card now says where it came from: "Pulled from <feed> on <date>" or "Checked by hand on <date>." If a feed is down, the build logs a warning and uses the last good copy saved in the repo. `content/README.md` explains the three tiers and how to add a feed.
- **Scoreboard:** the Deadlines page went from 7 hand-checked dates to 7 plus 38 from live feeds (about 28 in the next two months), with no hand copying.

## 2026-10-28: Funder lens on Cities Deliver

- **Considered:** applying to Cities Deliver (#42). The program requires a city of 50,000 or more; Morgantown had 30,347 in 2020, so we are probably not eligible.
- **Chose:** to learn from the program anyway, since it lays out clearly what a major AI-for-cities funder thinks good work looks like.
- **Shipped:** [docs/playbook/funder-lens-cities-deliver.md](playbook/funder-lens-cities-deliver.md): focus areas, the example projects in Cali, Cape Town, and Rio, their seven principles mapped against our charter with gaps, seven lessons to adopt now, and project directions for the needs register to test.
- **Scoreboard:** no change.

## 2026-10-28: The chronicle, starting with day one

- **Considered:** leaving the project's history in PRs and issues only, versus a public record with pictures that a resident, a reporter, or the next AI session can read in five minutes.
- **Chose:** a chronicle in `docs/chronicle/`: daily snapshots of the live site and project numbers, a running timeline, and short dispatches.
- **Shipped:** the [day one dispatch](chronicle/2026-10-28-day-one.md), the first snapshot (12 screenshots at phone and laptop width in light and dark mode, a 14 second walkthrough video, and `snapshot.json` with issue, PR, commit and calendar counts, about 1.3 MB), a seeded [timeline](chronicle/timeline.md), and `site/scripts/chronicle.mjs` to repeat it for any date. A separate PR for David proposes running it daily in GitHub Actions.
- **Scoreboard:** no change. This records state; it does not measure findability.
## 2026-10-28: Landscape of peer AI civic projects

- **Considered:** a lead list of 16 projects putting AI to work for communities, from the coordinating session at David's request, plus a search for West Virginia and Appalachian efforts.
- **Chose:** a living map in `docs/playbook/landscape.md`, with failures and shut-downs on purpose, because they teach the most.
- **Shipped:** 19 verified entries with status, what we can adopt, how we could amplify each, lessons, and a monthly upkeep routine for Duet. Two leads were corrected: the Ruston assistant is for Ruston, Washington, and "CommunityLLM" could not be found. Morgantown's city website runs on CivicPlus.
- **Scoreboard:** no change.

## 2026-10-28: Design rubrics and the first site review

- **Considered:** reviewing only accessibility (the most rule-bound area) versus a full set of rubrics. David asked that everything people use be reviewed by agents against clear rubrics, so a full set came first.
- **Chose:** six rubrics in `docs/rubrics/` (accessibility, interface and interaction, visual design, information architecture, plain language, trust and civic ethics), each with 7 or 8 criteria scored 0 to 3, a "how to check" line an agent with Playwright can follow, and a pass bar. Then a full review of the live site with them.
- **Shipped:** the rubrics and a how-to in `docs/rubrics/README.md`, the review in `docs/reviews/2026-10-28-site.md` with screenshots, a rerunnable review script, and six `for:code` design issues (#46 to #51).
- **What the review found:** zero automated accessibility violations, pages of about 2 KB, and sources on every item. The biggest gaps: the calendar subscribe link likely fails on Android and Google Calendar, empty states and the 404 page are dead ends, and reporting a mistake needs a GitHub account. No rubric passes yet; averages range from 1.13 (information architecture) to 2.25 (accessibility).
- **Scoreboard:** rubric averages above are the starting point for design quality. Next review after #46 to #51 close.

## 2026-10-28: Project playbook of proven practices

- **Considered:** building every process from scratch versus borrowing from civic tech (GOV.UK, the U.S. Digital Services Playbook, 18F, Code for America), open data standards (Open Referral HSDS, iCalendar, schema.org, Open311), nonprofit practice (theory of change, Results-Based Accountability, asset-based community development), evaluation science, and fact-checking codes.
- **Chose:** a short playbook in `docs/playbook/` (#33). It names 15 practices we adopt and explains each one with sources, so every session builds on what has worked elsewhere.
- **Shipped:** a summary page and five detail files. Also filed six adoption issues: HSDS mapping (#36), schema.org markup (#37), an AI disclosure and corrections policy on the About page (#38), report-a-problem links and stale flags on listings (#39), a measurement plan template with counting rules (#40), and an analytics options brief for David (#41).
- **Scoreboard:** no change. This is groundwork for measuring honestly.


## 2026-10-28: First site and the deadlines calendar

- **Considered:** the starter topic options in #4 (recycling and disposal, poverty resources, and others) and the five build issues Duet filed from its landscape map pass (#12 to #16).
- **Chose:** the community deadlines calendar (#14). Time-sensitive help is the easiest thing to miss, it is useful to nearly everyone, and Duet is already researching dates for it (#17).
- **Shipped:** the first version of the site (Astro, hosted on GitHub Pages, rebuilt every morning so past dates drop off), a Deadlines page, a calendar feed people can subscribe to on their phones, a content checker that blocks entries without sources, and the starting calendar entries. Also set licenses (MIT for code, CC BY 4.0 for content).
- **Scoreboard:** no measurements yet. The findability score is the next thing to set up.
