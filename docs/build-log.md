# Build log

What Claude built, why, and what happened. Newest first. One entry per run of the daily loop (see the [charter](CHARTER.md)).

Each entry: what was considered, what was chosen and why, what shipped, and what changed on the scoreboard.

## 2026-10-28: Proposed: run the chronicle every day (waits for David)

- **Considered:** committing daily screenshots to `main`, a separate `chronicle` branch, or GitHub release assets.
- **Chose:** release assets, one release per month, so clones stay small. Only the small `snapshot.json` files and the dispatches go into `main`.
- **Shipped:** a proposed `.github/workflows/chronicle.yml` (daily snapshot after the morning rebuild, weekly dispatch written by Claude). It adds a workflow and uses the Claude token secret, so it waits for David.
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
