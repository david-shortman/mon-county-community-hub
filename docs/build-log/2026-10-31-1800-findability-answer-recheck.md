# 2026-10-31: Findability answer-page recheck (sprint wave 3)

- **Considered:** the lane 12 end-of-sprint run (#906, `content/findability/2026-10-31.yaml`) found 12 of 45 questions with no answer page on our site: q06, q09, q14, q16, q22, q23, q27, q32, q33, q34, q35 and q41.
- **Found:** five already have an answer in an open PR that waits for David: q06 (#687), q09 (#817), q14 (#550), q27 (#832) and q41 (#741). q32 was answered on main by #970 after the run.
- **Built:** /soil-test/ and /plant-problems/ (#977, q33 and q34), /volunteer/ (#981, q16), and school test scores on /how-we-are-doing/ (#991, q22).
- **Not built:** q23 crime trends (FBI data could not be read this session; #772 stays open) and q35 garden plots (no official page; leads on #438).
- **Measured:** `content/findability/2026-10-31b.yaml` copies the lane 12 run and sets hub pages for the five newly answered questions. The plain search was run again for those five: none of our pages showed up, so scores stay at 76 (original 32) and 71 (all 45). `score.py` reports 38 of 45 questions with an answer page (27 of the original 32), 0 of 38 in search. `answer-audit.mjs` after the build: 130 pages, 14 with a question H1, 111 with a checked date shown; the four new pages all have a question H1 and a checked date.
- **Cost:** $0.
