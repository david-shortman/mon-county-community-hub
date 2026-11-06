# 2026-11-05: Start a business reads its facts from records (#122)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - The epics' open children are done, blocked or high stakes.
  - #571 (child care) waits on a call.
  - #122, the freshness architecture, listed "other guide pages with typed facts" as its next step. Among pages that are not high stakes, `/start-a-business/` has the most typed phone numbers, fees and hours (24).
- **Chose:** move `/start-a-business/` to fact records. Small business is one of the project's topic areas, and a fact record gets its own checked date and a "may be out of date" note when it is due.
- **Shipped:**
  - 12 fact records in `content/facts/business/`, each with the source's exact words, re-read 2026-11-05:
    - the city's steps page: zoning, Certificate of Occupancy, inspections, City Hall
    - the state Tax Division's questions page: the $30 registration, who pays no fee, when no certificate is needed, how long it lasts, tax help lines
    - the health department's Environmental Health page: food permits
  - Each record has a re-check of 180 days, or 365 for state rules.
  - Steps 1, 2, 4 and 5, food permits and City Hall now render with `Fact`. Nothing changed in meaning.
- **Not yet:** steps 3 and 6 (city license and B&O tax) cite the city's permitting and B&O pages. Those answered 403 this run, so they stay typed, and the next run can convert them. The food permit line no longer says "temporary events", because today's read of the health department page did not show it.
- **Scoreboard:** freshness. The only typed phone numbers left on `/start-a-business/` are in steps 3 and 6. Check that the Health check's on-time line still counts these records at the November 9 retro.
