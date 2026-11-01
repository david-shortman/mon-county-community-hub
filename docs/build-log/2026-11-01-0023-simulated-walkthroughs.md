# 30 simulated resident walkthroughs on a phone

**What.** A repeatable check that walks 30 made-up resident tasks on the built site at phone width, by tapping from the home page and by search, and scores each on six rubric criteria. Script, tasks and the first results are in `content/findability/walkthroughs/`; the write-up is `docs/reviews/2026-10-31-simulated-walkthroughs.md`.

**Why.** The charter's "our own tests" signal, at scale. These are simulated, not real residents. The first run scored 85 of 100 before fixes and 88 with the fix PRs built together. It found 2 dead ends, 18 of 60 searches that missed, and many answers at the bottom of long door pages. Fixes: #1153, #1156, #1160, #1163, #1171. Bigger gaps: #1173, #1174, #1175. Part of #529.
