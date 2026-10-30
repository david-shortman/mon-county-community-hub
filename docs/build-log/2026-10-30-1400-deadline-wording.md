# 2026-10-30: One way to write deadlines (#51)

- **Considered:** what was left of #51 after #361 and #364: weekday names on dates, one deadline wording, and a content check for time formats. Calendar date chips already show the weekday, and checked dates are small print, so only deadlines in text needed weekdays.
- **Chose:** one wording that leaves no doubt the last day counts: "The last day is Tuesday, December 15." Times follow the existing style ("8:30 a.m.").
- **Shipped:** the homestead exemption, Marketplace and property tax entries reworded with weekdays, no change in meaning; "8:30 am to 4:30 pm" now "8:30 a.m. to 4:30 p.m."; the LIEAP line on the utility bill page reads "with a last day of Friday, January 30". The rule is in `identity.md` (voice notes) and `content/README.md`. The time-format warning in `check-content.mjs` is left for the maturity session, which owns that file.
- **Scoreboard:** none.
