# 2026-10-31: Count in-person listings by area

- **Considered:** the reach check (#112) found that most in-person listings are in Morgantown, while about 72% of residents live outside the city. Nothing tracked it (#834).
- **Chose:** a small read-only script that counts in-person listings (resources with an address, community places, secondhand shops) by mailing town, and a table on the scoreboard. Towns it does not know are listed as "check these" rather than guessed.
- **Shipped:** `content/findability/reach.py` and a "Reach: in-person listings by area" table in [the scoreboard](../scoreboard.md#reach-in-person-listings-by-area). First count: 80 in-person listings, 59 in Morgantown, 18 in the rest of the county (11 of them community centers and halls), 3 outside the county.
- **Scoreboard:** Level 1, new reach table. Check at each findability run; it should rise as topic lanes add help outside Morgantown.
