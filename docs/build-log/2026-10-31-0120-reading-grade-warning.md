# 2026-10-31: A build warning for page openings above grade 9

- **Considered:** the charter asks for about grade 8, and 16% of Mon County adults read at the lowest level. Nothing measured it: the source benchmark found a grade 12 opening (#804) that no check had flagged (#833, from the reach check #112).
- **Chose:** a warning, not a failure, on the first two sentences after each page's H1, since that is what most people and answer engines read. Same Flesch-Kincaid formula as the benchmark. Lists and phone blocks are skipped.
- **Shipped:** `site/scripts/check-reading.mjs`, run at the end of every build. First run: 91 page openings checked, 15 above grade 9. Most are community center pages whose first sentence packs a long description (lane 5); the dentist and medicine page is at 10.7 (#804).
- **Scoreboard:** Level 1 "plain language" dimension. Check the count of pages above grade 9 at the next findability run; it should fall.
