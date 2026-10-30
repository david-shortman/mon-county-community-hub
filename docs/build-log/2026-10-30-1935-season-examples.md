# 2026-10-30: Seasonal door examples: one-sided dates, Morgantown time, documented

- **Considered:** #485 let home page door examples carry `from` and `until` dates. The review asked for three follow-ups: confirm a rebuild happens around the switch days (#488), document the fields (#489), and let an example use only one of them.
- **Chose:** no new schedule. The Site workflow already rebuilds every morning at 10:17 UTC (6:17 a.m. in summer, 5:17 a.m. in winter, Morgantown time), so Sept 1 and Jan 1 switch on their first build. Instead, the date check now uses Morgantown time (a build late in the evening used the next UTC day before), works with only `from` or only `until`, and handles a span across the new year like November to March.
- **Shipped:** `inSeason` in `site/src/lib/pages.mjs`, a schema note in `content/README.md`, and a `check-content` rule that fails on a date that is not a quoted `"MM-DD"`.
- **Scoreboard:** none directly; keeps seasonal examples (flu shots now, storm and fall cards next) from showing out of season.
