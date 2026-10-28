# 2026-10-28: A next step at every dead end

- **Considered:** a link to 211 only in empty states, or a shared "Need help now?" box on the key pages plus better empty-state text.
- **Chose:** both. A shared `HelpNow` component (call 211, text 898-211, wv211.org, with source and checked date from `content/resources/wv-211.yaml`) on the home and calendar pages, and empty-state text that says what to do instead. Phone numbers in calendar entries now render as `tel:` links. A custom `404.astro` links home and to the calendar.
- **Shipped:** issue #47. Not done: the homestead item names the Monongalia County Assessor but links only to state code. We have no verified Assessor URL, so `for:duet` issue #148 covers it.
- **Scoreboard:** findability task "I need food this week" (IA1), re-test after merge and on the next weekly audit.
