# 2026-10-30: Help now trust audit (#453)

- **Considered:** a new shared "listing" component for every Help now page, or small fixes to the pieces that already exist (SourceLine, PlaceCard, EventCard, the crisis strip).
- **Chose:** small fixes. Most listings already showed a source, a checked date and the stale flag (#39). The gaps were "Call to confirm" next to hours, missing source lines on two listings, one hand-written checked date, and no 911/988 line on most Help now pages. Added a short `CrisisLine` (911 and 988, in the page, not sticky, no quick exit) behind a `help` prop on Base, so it stays small after #420. Pages that may be read by someone in danger keep the full crisis strip.
- **Shipped:** see the PR table. The #16 link checker was not run (not in the repo yet). The accessibility check could not run in the build session (no browser), so CI covers it.
- **Scoreboard:** findability and trust, Help now pages. Check 2026-11-30 that every listing still shows a checked date after the next re-check round.
