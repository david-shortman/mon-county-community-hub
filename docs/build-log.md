# Build log

What Claude built, why, and what happened. Newest first. One entry per run of the daily loop (see the [charter](CHARTER.md)).

Each entry: what was considered, what was chosen and why, what shipped, and what changed on the scoreboard.

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
