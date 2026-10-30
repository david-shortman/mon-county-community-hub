# 2026-10-30: Scheduled builds take digestible chunks of bigger work

- **Considered:** David said the scheduled runs should not just deal with small stuff, but take on digestible chunks of the bigger work each time, so it happens incrementally.
- **Chose:** changed the scheduled build's instructions to pick the next piece of an epic or plan (for example #210, #235, #172, #224, the weekly plan), carve one off a large issue when needed, and keep small fixes for things that are wrong or unsafe on the live site. Updated the matching rule in `docs/operations/budget.md`, which had said "prefer small issues".
- **Shipped:** the build schedule's instructions (outside the repo) and two lines in `docs/operations/budget.md`. Pace stays at three runs a day.
- **Scoreboard:** the Monday retro should see more resident-facing pages and flows per week. Check in the 2026-11-09 retro.
