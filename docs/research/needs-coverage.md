# How well the site helps with each need

A review of the needs register (`content/needs/`, `/needs/`) against our own pages, done November 1, 2026 for #1248, part of the wave 8 sprint (#529). For each need: which pages serve it, how easy they are to reach, and what is still missing. The short version of each row is in the need's own file as `get_help` and `site_coverage`, and shows on `/needs/`.

"Reach" means how a resident gets there from the home page today. Doors are the five big buttons on the home page (`content/doors.yaml`).

| Rank | Need | Coverage | Main pages | Reach | What is missing |
|---|---|---|---|---|---|
| 1 | Having enough food | Good | `/help/food/`, `/snap/`, `/after-you-apply/snap/`, `/families-and-kids/` | Home page button "Short on food" in Get through this month | Pantry hours that sources disagree on (#932); no public count of people served |
| 2 | Paying for health care and medicine | Good | `/no-insurance/` (with hospital bill help, #985), `/dental-and-prescriptions/`, `/medicaid-2027/`, `/turning-65/`, `/care/` | Get care door, buttons "Can't afford a doctor or medicine" and "Keep my Medicaid in 2027" | Help is spread across several pages, so `/care/` is the start |
| 3 | Affording a place to live | Partial | `/money/?pick=rent`, `/life-events/losing-my-home/`, `/renting/`, `/after-you-apply/housing-voucher/`, `/behind-on-mortgage/` | Home page button "Behind on rent" opens a short section; the full Legal Aid card is two taps in (#202 benchmark) | No single housing starting page (#202, Duet's); wait lists for vouchers are not posted in one place; Fair Market Rent check (#740) |
| 4 | Keeping the heat, power and water on | Good | `/utility-bills/`, `/after-you-apply/lieap/`, `/file-today/` | Home page button "Heat, water or power bill" | Program windows change each year; source link beside each program (#135) |
| 5 | Getting mental health care | Good | `/mental-health/`, `/drugs-and-alcohol/`, `/no-insurance/` | Get care door, first button | No public list of counselors taking new patients, so the site cannot show one |
| 6 | Drug and alcohol use, and overdose deaths | Good | `/drugs-and-alcohol/`, `/mental-health/` | Get care door, second button | No public source lists open treatment or recovery beds |
| 7 | Finding and paying for child care | Partial | `/families-and-kids/#child-care`, `/after-you-apply/child-care/`, `/school-age/#care` | Family door | Who qualifies for the state child care subsidy is not explained (#571); open slots are not listed anywhere public |
| 8 | Loneliness and having someone to count on | Good | `/find-your-people/`, `/meet-people/`, `/community-centers/`, `/staying-active/`, `/volunteer/` | Community door links Meet people; Find your people has no door link | Many groups post only on social media, so listings have few details |
| 9 | People without a place to sleep | Good | `/stay-tonight/`, `/tonight/`, `/life-events/losing-my-home/` | Help now bar on the home page, and the Help now link | Warming shelter plans change each winter (#219, #863) |
| 10 | Wages that cover the basics | Partial | `/help/what-help/`, `/find-a-job/`, `/pay-for-training/`, `/free-tax-help/`, `/file-today/` | Find a job is on Work and learning; tax help is a choice in Get through this month; What help might I get has no door link | No local page shows a basic household budget (tax credits for working households are on `/free-tax-help/`, #987) |
| 11 | Getting where you need to go | Good | `/getting-around/`, `/bus-routes/`, `/bus-passes/`, `/medical-rides/` | Living here door | Listings do not say whether a bus gets you there and back (#407) |
| 12 | Obesity, diabetes and heart health | Thin | `/diabetes-and-weight/`, `/staying-well/`, `/staying-active/`, `/parks/` | Get care door | `/diabetes-and-weight/` lists two programs; free classes and screenings are not gathered |

## Groups added to "who is working on it"

These groups already had a record in `content/orgs/`, checked against their own pages, and their records show they work on the need. They were missing from the register.

- Enough food: Mountaineer Food Bank (was a plain name, now its record), Salvation Army Morgantown (free meals at Hope Café), Morgantown Area Meals on Wheels.
- Paying for health care: Clay-Battelle Health Services (sliding fee, pharmacy).
- Affording a place to live: North Central West Virginia Community Action (now its record), WV Housing Development Fund (help for its borrowers behind on payments).
- Utility bills: North Central West Virginia Community Action (now its record; weatherization).
- Mental health care, and drug and alcohol use: Valley HealthCare System (the behavioral health center for Mon County), First Choice Services (HELP4WV and the state's 988 calls).
- Child care: the Child Care Resource Center.
- People without a place to sleep: Hazel's House of Hope (shared building with Grace Shelter and other help).

## Gaps that our own pages have since filled

- Medicaid in 2027: `/medicaid-2027/` (#221). Removed from need 2.
- Free naloxone and treatment today: `/drugs-and-alcohol/` (#477). Removed from need 6.
- Renter guides to repairs and leases: `/renting/` (#565, #566). Need 3 now names the missing starting page instead.
- The state's child care provider search: linked on `/families-and-kids/` (#943). Need 7 keeps the open-slots gap.

## How to keep this current

Re-check a need's `site_coverage` when a page for it is added or changed, and update its `checked` date. `npm run check-content` fails if a `get_help` link points at a page that does not exist.
