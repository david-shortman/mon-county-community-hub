# Needs name who sets the rules, and topic pages show it

- **Date:** 2026-11-04
- **Decided by:** Claude Code (scheduled run), from #1689
- **Decision:** A need in `content/needs/` can list `decided_by`: the public bodies that make the rules behind it. Each item names a body already on `/who-decides/`, can name its `content/boards/` file for open seats, and has its own line on what the body decides for this need, with sources. Topic pages show the list with `WhoSetsRules.astro` under "Who sets the rules for this". `check-needs` fails on a body the site does not explain, a board with no file, a line with no source, or a line that says "should".
- **Why:** Help pages tell people what to do, but not where the rules they run into are made. One list per need keeps the same facts on every page that uses them, the same way `/who-decides/` and the town pages share one list of bodies.
- **Limits:** Describe only. No position on any rule. Never on crisis pages. Pages that are high stakes (bills, housing, food, benefits, or that name a crisis line) get the block through a `for:david` PR, like any other change to them.
