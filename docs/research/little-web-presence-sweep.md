# Little web presence sweep: what to re-read and how often

Last checked: 2026-10-30. Later runs, one file each: [`little-web-presence-runs/`](little-web-presence-runs/).

For issue #22. Some groups post little online, so their facts go stale fast. This is the recurring check list: for each group, the page to re-read, what to look for, and how often. A Claude session or a person can run it. Never call or email anyone as part of the sweep; if a fact can only be confirmed by phone, open a `needs-verification` issue for David.

## Newest dated public source found today

| Group | Best current source | Newest dated item seen | Notes |
| --- | --- | --- | --- |
| Senior Monongalians | [seniormons.org](https://www.seniormons.org/) and its [meals page](https://www.seniormons.org/blank) | Site footer "© 2026"; photo gallery items from 2025. Weekly "Senior News" column in the Dominion Post, newest opened: [Sept 4, 2026](https://www.dominionpost.com/2026/09/04/senior-news-5/) | The Oct 28 map said "No website found." It has one. The home page banner about a Tuesday, August 17 closure has no year. Its About page gives a different phone number (see the conflicts list). Entry: `senior-monongalians`. |
| Scott's Run Settlement House | [srsh.org](https://www.srsh.org/) | No date on the page; footer says "©2023". Hours changed since our Oct 28 check | Our current entry is out of date. See "Fixes needed" below. |
| Town of Blacksville | County [contact directory](https://www.monongaliacounty.gov/contact_information_for_county_agencies_and_departments/index.php) | Undated directory. Newest news: Dominion Post [Blacksville tag page](https://www.dominionpost.com/tag/blacksville/), "Small town, strong spirit: Blacksville lights the season," Dec 1, 2025 | No town website. Phone and P.O. box from the county directory only. Entry: `town-of-blacksville` (in PR #675). |
| Monongalia County Solid Waste Authority | [monongaliacountyswa.com](https://www.monongaliacountyswa.com/) | Events listed for Oct 31, 2026 (electronics recycling) and Nov 7 and Nov 14, 2026 | Now current. The Oct 28 map said its news stopped in June 2024; that is no longer true. The site shows no phone number. Our entry is fine. |
| Region VI Planning and Development Council | [regionvi.com/about](https://regionvi.com/about) | Footer "© 2026". The [news page](https://regionvi.com/news) says "No News Yet" | No meeting dates posted. Entry: `region-vi-planning-and-development-council`. |
| Winter warming shelter | News only. Newest: [Dominion Post, Aug 25, 2026](https://www.dominionpost.com/2026/08/25/funding-the-final-outstanding-detail-of-warming-shelter/) and [WAJR, Aug 24, 2026](https://wajr.com/2026/08/24/catholic-charities-west-virginia-makes-request-to-mon-county-commission-for-warming-shelter-funding/) | Aug 25, 2026 | Planned for the first floor of Hazel's House of Hope, run by Catholic Charities WV (Grace Shelter). City committed $40,000; a county request was pending. No opening date or hours announced. County Commission agendas from Aug 12 to Nov 4, 2026 do not mention the shelter by name. No org entry drafted; this belongs on `/stay-tonight/` (see build log 2026-10-29-1515). |

## Fixes needed to existing entries

- **`content/orgs/scotts-run-settlement-house.yaml`**: fixed in the same PR as this note. The [srsh.org home page](https://www.srsh.org/) now says Fairchance Road is open Monday to Wednesday and Lady Bug Drive Thursday to Friday, 8:30 a.m. to 4:30 p.m. Phone (304-435-5098) is unchanged.

## Recurring check list

| Group | Page to re-read | Look for | How often |
| --- | --- | --- | --- |
| Winter warming shelter | [WAJR search "warming shelter"](https://wajr.com/?s=warming+shelter), [Dominion Post Hazel's House tag](https://www.dominionpost.com/tag/hazels-house-of-hope/), [County Commission agendas](https://www.monongaliacounty.gov/commission/meeting_schedule/index.php), [Grace Shelter page](https://www.ccwva.org/programs/grace-shelter/) | Opening date, hours, location, who to call | Weekly, November to March. Monthly, August to October |
| Senior Monongalians | [seniormons.org](https://www.seniormons.org/), [meals page](https://www.seniormons.org/blank), Dominion Post "Senior News" column | Hours, phone, meal times, closures | Monthly |
| Scott's Run Settlement House | [srsh.org](https://www.srsh.org/) | Hours, addresses, phone | Monthly (it changed within 2 days of our last check) |
| Town of Blacksville | [County contact directory](https://www.monongaliacounty.gov/contact_information_for_county_agencies_and_departments/index.php), [Dominion Post Blacksville tag](https://www.dominionpost.com/tag/blacksville/) | Phone, any new town website, sewer or water notices | Every 3 months |
| Monongalia County Solid Waste Authority | [monongaliacountyswa.com](https://www.monongaliacountyswa.com/) | Event dates (electronics, tires, paint), contact info | Monthly |
| Region VI PDC | [regionvi.com/about](https://regionvi.com/about), [regionvi.com/news](https://regionvi.com/news) | Phone, address, any meeting notices | Every 6 months |
| Westside Senior Center | [westoverwv.org/westside-senior-center](https://www.westoverwv.org/westside-senior-center) | Hours, dues, phone | Every 3 months |
| Clay-Battelle Area Senior Citizens (Blacksville) | [County contact directory](https://www.monongaliacounty.gov/contact_information_for_county_agencies_and_departments/index.php) | The only listing found; its blog address was not checked | Every 6 months. No entry drafted until a second current source is found |
| Inactive groups in [inactive-orgs.md](inactive-orgs.md) | WV Secretary of State record, ProPublica, county directory | Whether still listed anywhere as active | Every 6 months |

## Gaps and open questions

- Senior Monongalians: which phone number is the main line, 304-296-9812 (home page, meals page) or 304-685-4502 (About page)? Needs a call by David.
- Blacksville: the only phone and address come from the county directory, which also carries stale entries (see conflicts list). A second source would help.
- Warming shelter: no public page from Catholic Charities WV or Hazel's House for the 2026-27 winter yet.

## Ideas

- Run this sweep as a scheduled agent task that opens a PR or issue when a watched page changes. Cost: free (existing tools).
- Ask the County Commission office to refresh its contact directory using the conflicts list. Cost: free.
