# 2026-11-03: Source check no longer stops on one slow page

- **Considered:** raising the timeout, or catching the error.
- **Chose:** catch it. The timeout also covers reading the page body, and that error was not caught, so one slow page ended the whole run (Health #1716).
- **Shipped:** `fetchSource` in `site/scripts/check-sources.mjs` now records a slow body read as a failed read for that page and keeps going.
- **Scoreboard:** Source check runs on main. Check the next scheduled run (2026-11-04).
