# 2026-10-28: Calendar add options and event times

- **Considered:** keeping one `webcal:` link; adding separate links per app; reading times from feeds too.
- **Chose:** a labeled "Add to your calendar" section (iPhone or Mac, Google Calendar, Outlook, download, copy link, how to stop). Optional `start_time` and `end_time` on hand-checked single-day entries, written to the feed as timed events with `TZID=America/New_York` and a `VTIMEZONE`. Feed-sourced entries are left alone because #31 owns `site/src/lib/feeds/`. No end time is invented when the source gives none.
- **Shipped:** `/calendar/` buttons (48px tall), `calendar.ics` timed events, `check-content` time checks, schema note in `content/README.md`. The tire drop-off (8 a.m. to noon) and mobile pantry (10 to 11:30 a.m.) now carry their times.
- **Not verified:** no real Android, Apple Calendar, or Google Calendar import was possible from this run, and the Google and Outlook add links follow their documented URL patterns but were not clicked. Please confirm on devices.
- **Scoreboard:** findability of "add to calendar" on Android (design review II4, II6). Check after a device test.
