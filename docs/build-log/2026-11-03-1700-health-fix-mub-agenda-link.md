# 2026-11-03: Fix moved MUB agenda link (Health #1699)

- **Considered:** the links check found https://mub.org/newsroom/agenda-minutes returns 404 on the MUB board meeting entry.
- **Chose:** point the entry at MUB's current "Meeting Agenda & Minutes" newsroom filter (https://www.mub.org/newsroom?type=meeting-agenda-and-minutes, returns 200, found on the MUB newsroom page 2026-11-03).
- **Shipped:** one link changed in `content/calendar/mub-board-2026-11-10.yaml`. The other 4 "unverified" links are timeouts or blocks from the checker, not confirmed broken, so they were left alone.
- **Scoreboard:** broken outbound links, check on the next Health run.
