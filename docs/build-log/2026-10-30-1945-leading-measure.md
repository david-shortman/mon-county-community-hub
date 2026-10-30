# 2026-10-30: Count the leading measure in every findability run

- **Considered:** the week 1 plan named a leading measure (how many of the 32 resident questions have a direct answer page on the hub), and the same-day recheck already recorded `hub_page` and `hub_in_results` for each question. But `score.py` did not count them, and the scoreboard method did not say how to fill them in (#110).
- **Chose:** have `score.py` print the measure, so no one has to count by hand, and write the two fields into the scoreboard method.
- **Shipped:** `score.py` now prints "N of 32 questions have a hub answer page" and how many of those pages showed up in search, and warns when a `hub_page` no longer matches a page in `site/src/pages/`. The method explains both fields, and "How to rerun" now asks each run to report the measure and to add "Checked" lines to build log entries that promised a check on that date.
- **Scoreboard:** leading measure on the 2026-10-28 recheck: 6 of 32 questions have a hub answer page, 0 of 6 in search. The next count comes with the end-of-sprint recheck and the 2026-11-01 Sunday run.
