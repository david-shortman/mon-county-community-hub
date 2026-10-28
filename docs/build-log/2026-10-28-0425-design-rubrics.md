# 2026-10-28: Design rubrics and the first site review

- **Considered:** reviewing only accessibility (the most rule-bound area) versus a full set of rubrics. David asked that everything people use be reviewed by agents against clear rubrics, so a full set came first.
- **Chose:** six rubrics in `docs/rubrics/` (accessibility, interface and interaction, visual design, information architecture, plain language, trust and civic ethics), each with 7 or 8 criteria scored 0 to 3, a "how to check" line an agent with Playwright can follow, and a pass bar. Then a full review of the live site with them.
- **Shipped:** the rubrics and a how-to in `docs/rubrics/README.md`, the review in `docs/reviews/2026-10-28-site.md` with screenshots, a rerunnable review script, and six `for:code` design issues (#46 to #51).
- **What the review found:** zero automated accessibility violations, pages of about 2 KB, and sources on every item. The biggest gaps: the calendar subscribe link likely fails on Android and Google Calendar, empty states and the 404 page are dead ends, and reporting a mistake needs a GitHub account. No rubric passes yet; averages range from 1.13 (information architecture) to 2.25 (accessibility).
- **Scoreboard:** rubric averages above are the starting point for design quality. Next review after #46 to #51 close.
