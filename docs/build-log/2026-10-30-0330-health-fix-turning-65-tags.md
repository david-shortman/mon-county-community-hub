# 2026-10-30: Fix Site build: tag the Turning 65 page

- **Considered:** The Site build on main failed because /turning-65/ (#313) merged without the `page` tags that #314 now requires.
- **Chose:** Add the `page` export (care door, health topic) to the page. No check was changed.
- **Shipped:** Build passes again; the page shows in the Get care lists. Health issue #316.
- **Scoreboard:** Site workflow on main is green; check on the next Health run.
