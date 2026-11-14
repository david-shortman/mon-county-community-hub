# Needs register: source list

The sources behind `content/needs/` (#44) and the `/needs/` page. Each need file cites its own sources with a checked date. This page says where each source lives, how often it updates, and what we could not get yet.

Last checked: November 14, 2026 (re-check for #988; see "Re-check, November 14, 2026" below).

## Sources we use

| Source | What it gives for Mon County | How often it updates | Where |
|---|---|---|---|
| County Health Rankings | Food insecurity, severe housing cost burden, child care cost, overdose deaths, obesity, loneliness, uninsured, provider ratios, income inequality | No 2026 annual release. A March 2026 supplement refreshed 34 measures. What comes after December 2026 is not settled (see below) | [March 2026 supplement (CSV)](https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_supplement_20260325%5B1%5D.csv), [2025 data file (CSV)](https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_data2025_v3.csv) for child care cost, [county page](https://www.countyhealthrankings.org/health-data/west-virginia/monongalia). Saved copies (Internet Archive), with file names and checksums: [`content/sources/chr/`](../../content/sources/chr/) (#1906) |
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
- **Years for County Health Rankings measures in the 2025 file:** its data file and dictionary do not say which years each number covers, so the child care cost item cites the 2025 release instead of a year. The March 2026 supplement's codebook does list the years, so items that cite the supplement now have a `data_date` (see the November 14 re-check).
- **Census ACS tables:** not read automatically. On November 14, 2026, `api.census.gov` answered its robots.txt with a "Request Rejected" page and QuickFacts on `www.census.gov` answered 403, so under [our rule for automated reads](../operations/automated-reads.md) we read neither. A key was David's call before (#15). County Health Rankings republishes some ACS five-year numbers (severe housing cost burden, income inequality, broadband), and the hospital assessments cite others. A person can read `data.census.gov` by hand.

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

## Re-check, November 14, 2026

For #988, sprint wave 17 (#529). Every source above was re-read for a newer release. Nothing newer was found, so no figure and no rank changed. The changes are data years, checked dates and two fixes to the score notes.

| Source | Newer data? | What changed in the register |
|---|---|---|
| County Health Rankings | No. The [data documentation page](https://www.countyhealthrankings.org/health-data/methodology-and-sources/data-documentation) still lists the March 2026 supplement as the newest file, and the newest blog post is still October 20, 2026. | Each Mon County figure that cites the supplement was compared with the file and matches. The [supplement codebook](https://www.countyhealthrankings.org/sites/default/files/media/document/Analytic_Dataset_Codebook_Supplemental_Release_20260325%5B1%5D.pdf) lists the years behind each measure, so those items now have a `data_date`: food insecurity 2023, adult obesity 2023, loneliness 2023, uninsured 2023, mental health providers 2025, drug overdose deaths 2021 to 2023, severe housing cost burden and income inequality 2020 to 2024. |
| CHR&R website | Its [program FAQ](https://www.countyhealthrankings.org/findings-and-insights/blog/faq-chrr-program-status-and-funding) says the website "will stay up through December 2026" and asks users to download data "before the end of the year". The October 20 blog says county data will "remain available and continue to be updated" under new funding, but not where. | None yet. Eight needs and the How is Mon County doing? numbers cite CHR&R files, so their links may break in January 2027. Discovery: `docs/discoveries/2026-11-14-chr-website-through-december-2026.md`. |
| CHR&R trends file | `chr_trends_csv_2025.csv` has a Mon County series for uninsured (17% in 2008, 6% to 9% each year from 2015 to 2022). | None. It measures having coverage, not affording care, so the trend for paying for health care stays `unknown`. No other need's measure is in the trends file. |
| CDC PLACES | No. The data.cdc.gov catalog lists the 2025 county release (`swc5-untb`, data updated December 4, 2025) as the newest. | Each PLACES figure in the register was compared with the data and matches. Checked dates moved to November 14. |
| WV Office of Drug Control Policy | No. The county snapshots page still shows 2025 snapshots; a 2026 address returns 404. | None |
| WV Kids Count Data Book | No. The Kids Count page still links the 2024 data book. | None |
| Hospital needs assessments | No. Both are 2025 and run every 3 years. | None |
| United For ALICE | The county reports page answered 403. | None. ALICE shares still come from the Mon Health assessment. |
| Census ACS | Not read (see "What we could not get yet"). | None |
| Point in time count | No local 2026 count report found in a web search. | None |

Score notes fixed: the food need's `rank_why` said "about 13,370 people", a number from before the March 2026 refresh; it now says about 14,940, the figure the need cites. The housing need's `rank_why` still said 6,702 households; the cited figure is 6,386. That line names 211, so it is fixed in its own small PR that waits for David's review (High stakes check).

Re-scored with the rules on `/needs/`: food (14%) and housing cost burden (15%) are still above the 1 in 10 line for reach 3, and no other count moved, so every score and rank stays the same. Trends stay as they were: only drug overdose deaths has a source that shows change over time.
