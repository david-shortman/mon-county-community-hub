# 2026-10-30: Honest dates, a stale note and a report link on every card (#39, #51)

- **Considered:** some cards showed their newest source date, the calendar's "Updated" date could be a day older than its cards, times read two ways ("6:00 p.m." and "6 p.m."), and there was no way to report a problem with one item.
- **Chose:** put the rules in the shared pieces (`SourceLine`, `EventCard`, the time helpers) so every card follows them.
- **Shipped:**
  - Every card, including calendar and Help now cards, shows the oldest checked date across its sources.
  - Past 6 months (the rule in `content/README.md`) a card adds: "This may be out of date, so check with them before you go."
  - Resource, place, answer and calendar cards have a "Report a problem" link that opens our GitHub form with the item's name, slug and source filled in. It asks for nothing personal. The footer now says reports go to GitHub, need a free account and are public. A way to report without an account needs David (#48).
  - The calendar's "Updated" date is never older than an item's checked date.
  - Times: "noon" and "midnight" in calendar feeds too, no ":00" ("6 p.m."), and "AM"/"PM" in two records changed to "a.m."/"p.m.".
- **Scoreboard:** Trust TR2 (freshness signals), TR8 (a way to report mistakes), plain language PL6 (one time format).
