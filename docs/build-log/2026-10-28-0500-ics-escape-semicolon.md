# 2026-10-28: Escape semicolons in calendar.ics

- **Considered:** Fixing only the one line, or also reworking the escape helper. The helper is small and the other escapes are correct, so one line is enough.
- **Chose:** Change `'\;'` (which is just `';'` in JavaScript) to `'\\;'` so a semicolon in event text is written as `\;` as RFC 5545 section 3.3.11 requires.
- **Shipped:** Fix in `site/src/pages/calendar.ics.js`. Closes #77. The health check `ics-parses` already flags unescaped `;` and `,`.
- **Scoreboard:** No visible change today, since no entry has a semicolon. Protects the calendar feed once live feeds (#31) bring in outside text.
