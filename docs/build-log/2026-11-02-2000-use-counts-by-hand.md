# 2026-11-02: A place for Level 2 use counts, filled by hand (#1432)

- **Considered:** reading the visit counter (GoatCounter, #1352) from the weekly scorecard. Not allowed: its robots.txt says `Disallow: /` to every robot, the dashboard needs a login, the public visitor-count JSON is off (it answers 403), and the read API needs a key, which sessions may not add. Checked 2026-11-02.
- **Chose:** a small public file, `content/use/visits.yaml`, where David copies monthly totals from the dashboard. Monthly, not weekly, so per-page counts stay large enough to share. The build checks the small-count rule ("fewer than 10" for 1 to 9) and the dates.
- **Shipped:** `content/use/visits.yaml` (empty until the first month), `site/scripts/check-use.mjs` in `npm run check-content`, tests in `site/test/use.test.mjs`, the weekly scorecard's Outcomes row now reads the newest month, and the scoreboard's Level 2 row and section say where the numbers come from.
- **Scoreboard:** Level 2 moves from "not measured" to "waiting for the first monthly totals". Check after David enters November 2026 (early December).
