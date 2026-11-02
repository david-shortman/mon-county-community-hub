# Needs register: source list

The sources behind `content/needs/` (#44) and the `/needs/` page. Each need file cites its own sources with a checked date. This page says where each source lives, how often it updates, and what we could not get yet.

Last checked: November 1, 2026 (re-check for #988; see "Re-check, November 1, 2026" below).

## Sources we use

| Source | What it gives for Mon County | How often it updates | Where |
|---|---|---|---|
| County Health Rankings | Food insecurity, severe housing cost burden, child care cost, overdose deaths, obesity, loneliness, uninsured, provider ratios, income inequality | No 2026 annual release. A March 2026 supplement refreshed 34 measures. What comes after December 2026 is not settled (see below) | [March 2026 supplement (CSV)](https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_supplement_20260325%5B1%5D.csv), [2025 data file (CSV)](https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_data2025_v3.csv) for child care cost, [county page](https://www.countyhealthrankings.org/health-data/west-virginia/monongalia) |
| CDC PLACES | Model-based adult estimates: food, housing and utility insecurity, transportation, mental distress, depression, loneliness, chronic disease | Yearly | [County data, 2025 release](https://data.cdc.gov/d/swc5-untb) (no key needed) |
| J.W. Ruby Memorial Hospital Community Health Needs Assessment | 2025 community survey: top health and quality of life problems, and whether people can afford care | Every 3 years | [2025 PDF](https://wvumedicine.org/wp-content/uploads/2026/01/J.W.-Ruby-Memorial-Hospital-2025-Community-Health-Needs-Assessment-1162025.pdf) |
| Mon Health Medical Center Community Health Needs Assessment | Health department 2025 survey (1,457 answers), ALICE shares by household type, housing cost burden, West Virginia 211 requests by county, and North Central West Virginia Community Action's 2022 priorities | Every 3 years | [2025 PDF](https://www.monhealth.com/Uploads/Public/Documents/2025%20MHMC%20Community%20Benefit%20Needs%20Assessment%20and%20Implementation%20Strategies.pdf) |
| WV Office of Drug Control Policy county snapshot | Overdose deaths by year, naloxone, treatment beds | Yearly | [County snapshots](https://odcp.wv.gov/county-snapshots) |
| WV Kids Count Data Book (WV Center on Budget and Policy) | Child care gap, children on SNAP, school results by county | Yearly | [2024 data book, county page 63](https://wvpolicy.org/wp-content/uploads/2025/05/WVCBP_2024KidsCountDataBook_updated.pdf) |
| WV Bureau for Medical Services | Medicaid rule changes starting January 2027 | When rules change | [New Medicaid rules](https://bms.wv.gov/new-medicaid-rules-are-coming) |
| Local news, named by outlet | Point in time homeless count and shelter beds (MetroNews, July 26, 2026) | When reported | Cited in `homelessness.yaml` |

West Virginia 211's Mon County numbers (August 2024 to August 2025) come from the Mon Health assessment, page 62. This fills a gap in `docs/playbook/audience-facts.md`, which listed 211 needs as missing.

## What we could not get yet

- **United For ALICE county page:** the site returned 403 to our requests. We use the ALICE shares as reported in the Mon Health assessment instead.
- **Feeding America Map the Meal Gap:** the county page loads its numbers with scripts we could not read. County Health Rankings reports the same Map the Meal Gap figure, so we use that.
- **HUD Fair Market Rents:** HUD's page did not load for us, and the numbers on other sites disagree. Tracked in #740.
- **The point in time count report itself:** we found only news reports, which do not give the count's year. A records or partner ask would be David's call.
- **Years for County Health Rankings measures:** the data file and dictionary do not say which years each number covers, so need files cite the 2025 release instead of a year.
- **Census ACS tables by API:** need a key (David's call, see #15). Published tables cited in the hospital assessments are used instead.

## How to update

1. When a new release comes out, re-read the source and update the figure, `data_date` and `checked` in each need file that cites it.
2. Re-score with the rules on `/needs/` ("How we rank them") and change `rank` and `rank_why` in the same PR.
3. Only set `trend` to `better` or `worse` when a source shows the change over time, and say which in `trend_why`.

## Re-check, November 1, 2026

For #988. Every source above was re-read for a newer release.

| Source | Newer data? | What changed in the register |
|---|---|---|
| County Health Rankings | Yes. CHR&R says it "will not produce a 2026 Annual Data Release" but "updated data for 34 measures this March" ([blog, March 30, 2026](https://www.countyhealthrankings.org/findings-and-insights/blog/chrr-updates-data-for-34-measures-will-not-produce-a-2026-annual-data-release)). The refreshed numbers are in the [March 2026 supplement](https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_supplement_20260325%5B1%5D.csv) (dated 2026-03-25), not in `analytic_data2025_v3.csv` (last changed November 19, 2025). | Mon County figures now cite the supplement: obesity 36.7% to 34.2%, food insecurity 12.6% to 14% (about 14,940 people), severe housing cost burden 15.7% to 15%, loneliness 31.6% to 33.3%, income inequality 6.3 to 6.2, people per mental health provider 256 to 240, overdose deaths 42 to 43 per 100,000. Uninsured stays 6.2%. Child care cost was not refreshed and still cites the 2025 file. The food summary now says "about 1 in 7" (14%). |
| CHR&R's future | Its Robert Wood Johnson Foundation funding "concludes in December 2026". New funding means "county-level data for every county in the United States ... will remain available and continue to be updated", but "will not extend CHR&R as it exists today" ([blog, October 20, 2026](https://www.countyhealthrankings.org/findings-and-insights/blog/uwphi-secures-new-multi-year-funding-to-evolve-chrr-beyond-2026)). | None yet. Download addresses may change after December 2026. |
| CDC PLACES | No. The 2025 release (`swc5-untb`, updated December 4, 2025) is still the newest county release on data.cdc.gov. | None |
| WV Office of Drug Control Policy | No. The 2025 county profile we cite (`media/39878`) is the newest on the [2025 county snapshots page](https://odcp.wv.gov/resources/2025-county-snapshots). | None |
| WV Kids Count Data Book | No. The [Kids Count page](https://wvpolicy.org/west-virginia-kids-count/) still links the 2024 data book (May 2025). The newer "Data Book" news items are the national, state-level rankings. | None |
| Hospital needs assessments | No. Both are 2025 and run every 3 years. | None |
| WV Bureau for Medical Services | The page still loads; no change checked to the January 2027 rules in this pass. | None |

Ranks were not changed: each figure moved by less than the gaps between needs, and the ranking rules score severity, reach, agreement and room to help, not small changes in one number. Trends stay `unknown`, since CHR&R did not publish trend data with the supplement.

