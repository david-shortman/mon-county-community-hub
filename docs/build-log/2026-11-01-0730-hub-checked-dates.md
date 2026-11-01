# 2026-11-01: A "checked" line at the top of Community centers, Find your people and agenda pages

- **Considered:** #1288 (sprint wave 9, phone design, #529). In the November 1 simulated walkthroughs (made-up tasks, not resident feedback), Community centers and Find your people keep every checked date inside closed sections, so nothing on the first screen says when the page was checked. Agenda pages like `/meetings/agendas/school-board/` had no checked line the script could read.
- **Chose:** a short line under the lede of `/community-centers/` and `/find-your-people/` that gives how many listings there are and the oldest and newest checked dates among them (`CheckedRange.astro`). Each listing counts by its oldest source, like its card does. On each agenda body page, a line with the newest read date of the agendas and minutes it shows. A board with nothing on its page gets no line, since there is no date to give.
- **Cost:** $0.
