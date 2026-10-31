# Care needs ledger: the evidence behind the Get care order

The Get care door (`/care/`) lists its picks in the order below (#475, #483). This page is the evidence for that order: what each source says, where, and when we checked it. When new local data comes out, re-rank here first, then change `content/doors/care.yaml` to match.

Last checked: October 30, 2026.

## The ranked list

| Rank | In residents' words | Page | Main evidence |
|---|---|---|---|
| 1 | I need mental health help | `/mental-health/` (#203) | Top problem in the 2025 hospital survey (64%); top hard-to-get care and top hardships in the health department survey |
| 2 | Help with drugs or alcohol, and free Narcan | `/drugs-and-alcohol/` (#477) | Third top problem in the hospital survey (53%); 77 overdose deaths in 2023, 49 in 2024 |
| 3 | No insurance or can't afford a doctor | `/no-insurance/` (#478) | High cost of care is the top barrier in the health department survey; 25% could not say they can afford care |
| 4 | Keep my Medicaid in 2027 | `/medicaid-2027/` (#221) | New state rules start January 1, 2027; time sensitive |
| 5 | Can't afford my prescriptions | `/dental-and-prescriptions/` (#479) | Cost of care and medicine is the top quality of life worry (50%); 19% could not say they can afford medicine |
| 6 | Tooth pain or need a dentist | `/dental-and-prescriptions/` (#220) | Dental is on the health department's hard-to-get list |
| 7 | Find a doctor, or where to go tonight | not built yet (#21) | Primary care and appointment availability on the health department's lists |
| 8 | Pregnant or new baby | `/pregnant-or-new-baby/` (#245) | Family planning on the hard-to-get list |
| 9 | Ride to a medical appointment | `/medical-rides/` (#480) | 21% named access to transportation a top quality of life problem |
| 10 | Diabetes, blood pressure or weight | `/diabetes-and-weight/` (#481) | Obesity is the second top problem (57%); chronic disease management is hard to get |
| 11 | Birth control, pregnancy tests and STI testing | `/birth-control-and-testing/` (#482) | Family planning on the hard-to-get list |
| 12 | Turning 65, flu or COVID shot, staying healthy | `/turning-65/`, `/flu-shots/`, `/staying-well/` | Kept from the first version of the door |

Some pages above are still waiting for review in open PRs. A pick shows on `/care/` only once its page exists.

## Evidence

### Monongalia County Health Department 2025 community survey

Reported in Mon Health Medical Center's 2025 Community Health Needs Assessment, page 54 of the PDF ([source](https://www.monhealth.com/Uploads/Public/Documents/2025%20MHMC%20Community%20Benefit%20Needs%20Assessment%20and%20Implementation%20Strategies.pdf), checked October 30, 2026).

- 1,457 responses, mostly from Monongalia County, with some from Marion and Preston.
- Hardest care to get: "Mental Health, Chronic Disease Management, Dental Services, Family Planning, Primary Care, Substance Use Treatment."
- Top factors: "high cost of care, appointment availability, work schedule, lack of insurance, transportation, and lack of childcare." Cost and appointment availability were the top two for every adult age group and every income range.
- Top hardships: anxiety, depression and loneliness, then unpaid bills and missed or late rent or utilities.
- Caution: 71.5% of respondents were female, and 35.2% earned more than $100,000 a year, so the survey leans toward women and higher incomes.

### J.W. Ruby Memorial Hospital 2025 Community Health Needs Assessment

Prepared by the WVU Health Affairs Institute for Monongalia and Marion counties, dated November 21, 2025 ([source](https://wvumedicine.org/wp-content/uploads/2026/01/J.W.-Ruby-Memorial-Hospital-2025-Community-Health-Needs-Assessment-1162025.pdf), checked October 30, 2026). Mon Health's assessment reports the same survey (193 responses) on page 54.

- Most important health problems (page 22): mental health problems 64%, obesity 57%, drug and/or alcohol use 53%.
- Most important quality of life problems (page 23): cost of health care and/or medications 50%, homelessness 25%, access to transportation 21%.
- Agreement questions (page 66, 171 responses). The share who strongly or somewhat disagreed:
  - "I am able to afford medical care when needed": 25% (6% + 19%)
  - "I am able to afford medications when needed": 19% (4% + 15%)
  - "I am able to get mental health care when needed": 26% (10% + 16%)
- Ruby's prioritized needs (page 7): obesity and co-morbid chronic disease; substance abuse and mental health; cancer.
- Caution: 171 to 193 responses is a small sample, and 65% of respondents held a bachelor's degree or higher (Mon Health assessment, page 54).

### Mon Health Medical Center 2026 to 2028 priorities

Mon Health's ranked list (page 66 of the same PDF) puts these in its top 5: health education and promotion including screenings; emergency situations (funding and eligibility); substance use including drugs and alcohol; access to health care, dental services and medications; obesity and physical inactivity. Mental health (anxiety, depression and loneliness) ranks 11th. Earlier notes (#203) said Mon Health listed behavioral health as priority 3; the 2025 document does not.

### West Virginia Office of Drug Control Policy county snapshot, 2025

"At-A-Glance 2025" for Monongalia County ([source](https://odcp.wv.gov/media/39878/download?inline), from the [county snapshots page](https://odcp.wv.gov/county-snapshots), checked October 30, 2026):

- Overdose deaths: 77 in 2023, 49 in 2024.
- Naloxone kits distributed: 10,922 (approximate, from shipment data).
- Certified treatment beds: 124.
- The 2024 snapshot ([source](https://odcp.wv.gov/media/39732/download?inline)) listed 72 treatment beds. Recovery housing figures differ between the two years (74 and 6) and the 2025 sheet does not say whether the number counts homes or beds, so we do not use it.

### West Virginia Medicaid 2027 rules

The Bureau for Medical Services says: "Beginning January 1, 2027, some Medicaid members (age 19-64) must meet Community Engagement requirements, unless exempt," and current members face them at renewals "beginning with those due in March 2027" ([source](https://bms.wv.gov/new-medicaid-rules-are-coming), checked October 30, 2026).

## What we could not get yet

- **County Health Rankings** data for Monongalia County (uninsured rate, primary care and mental health provider ratios, adult obesity, poor mental health days). Not fetched yet.
- **A 2025 WV 211 breakdown** for Mon County. The last local breakdown we found is from 2021 (see `what-people-search-for.md`).
- **The ~33,000 figure** reported by West Virginia Watch (August 12, 2026) for West Virginians not meeting the Medicaid rule and not exempt. It comes from a legislative presentation we could not find.
- **Counselors taking new patients** in Mon County. No public source lists this; it would take calls to providers.

## How to re-rank

1. Add the new source under Evidence, with its page number and checked date.
2. Change the ranked table.
3. Change the order of `situations` in `content/doors/care.yaml` in the same PR.
