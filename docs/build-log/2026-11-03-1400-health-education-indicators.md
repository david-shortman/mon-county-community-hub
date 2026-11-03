# 2026-11-03: Life expectancy, overdose deaths and graduation on How we're doing

- **Considered:** the community health metrics gaps in `docs/research/2026-11-03-topic-depth.md`: no high school graduation rate, life expectancy, premature death or overdose deaths on `/how-we-are-doing/` (#1662, sprint wave 14, #529).
- **Shipped:**
  - **Life expectancy** and **drug overdose deaths** for Monongalia County, West Virginia and the US, from the County Health Rankings March 2026 supplemental file. Both cover 2021-2023, the years its codebook gives. `update-chr-indicators.mjs` now refreshes measures that are not in the trends file (no `trend_name`, no chart), so these refresh with the monthly check like the others.
  - **High school graduation rate** (four-year) for Monongalia County Schools and the state, 2020-2021 to 2024-2025, from the ZoomWV Graduation Summary (West Virginia Department of Education), read in a browser like the test scores. The chart starts in 2020-2021 because ZoomWV says alternate diplomas count from that year.
  - Numbers that are not percents now show rounded with their unit words ("77.8 years", "43 per 100,000 people"), set by `digits` and `per` in the record.
  - The Health intro no longer says every number is from the 2025 file: it names the March 2026 update and links its codebook.
- **Not done:**
  - **Premature death** (years of life lost before 75) is in the same file, but hard to explain in plain words next to life expectancy, which tells a similar story. Left out for now.
  - **Stale years check:** children in poverty is still 2023. It is not in the March 2026 supplement, and the Census Bureau's data service (`api.census.gov`) answers automated reads with a "Request Rejected" page, so a newer year was not checked. CDC PLACES is still the 2025 release, the newest CDC lists. Unemployment, uninsured and school tests are on their newest releases.
  - County Health Rankings also has a 2021-2022 graduation rate (`v021`), older than the state's own number, so it is not used.
