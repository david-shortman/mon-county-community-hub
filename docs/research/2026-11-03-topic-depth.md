# Topic depth: the founding topic areas

An audit of what the site has for five of the founding topic areas in `CLAUDE.md`, against what a resident would need. Done November 3, 2026 for the sprint wave 11 topic depth lane (#529). Poverty resources and managing medical care are covered by other lanes (needs coverage, life areas), so they are left out here.

Each area lists what the site has, the gaps, and which gaps this lane fills now. Facts here come from the pages named, read on November 3, 2026, unless a different date is given.

## Small business resources

**What the site has.** `/business/` (free SBDC coaching and classes, SBA district office, state business plan help, business groups), `/start-a-business/` (Morgantown's six steps, with the $30 state registration and the $65 Certificate of Occupancy), `/business-by-town/` (Star City, Granville, Westover and outside any town), `/star-city-business-license/`, `/open-a-restaurant/`, `/cottage-food/`, `/selling-food/`, `/contractor-license/`, `/permits/`, `/pay-for-training/`.

**Gaps.**

1. **Morgantown B&O rates and due dates.** No current city page states them (known since #638). The page tells people to ask the Finance Department. Nothing to add until the city posts them.
2. **Loans and money to start or grow.** Only the SBA card mentions loans. There is no list of state or local loan and grant programs for small businesses (for example the county development authority, state economic development programs or nonprofit lenders). Needs research on official pages first; money facts wait for David.
3. **SCORE and WVU LaunchLab.** Still not listed, because their pages could not be read in #638.
4. **Running a business from home.** No page says whether a home business needs city zoning approval. Not found on a city page in this pass.
5. **Hiring a first employee.** The One Stop portal is linked, but nothing explains state unemployment tax and workers' compensation in plain words.

**This lane:** gap 2 is the biggest, but it needs a research pass on official pages before it can go on the site. Listed here as next work.

## Local government: structure, policies, contacts

**What the site has.** `/who-decides/` (ten public bodies: what each decides, how members are chosen, when it meets), `/who-serves-me/` (police, trash, water and streets by town), `/meetings/` and agenda guides, `/have-your-say/`, `/make-it-better/boards/`, `/public-records/`, `/property-tax/`, `/vote/`, town pages under `/towns/`.

**Gaps.**

1. **Which county office does what.** The site describes boards and councils, but not the county's own offices that residents deal with most: the Assessor, the County Clerk, the Circuit Clerk, the Sheriff's Tax Office, the Prosecuting Attorney and its Victim Assistance Program, Magistrate Court, Litter Control, the Floodplain Administrator and MECCA's addressing line. Each has a record or a line on the county's [contact directory](https://www.monongaliacounty.gov/contact_information_for_county_agencies_and_departments/index.php), but no page answers "which office do I call for this?"
2. **City, county or state?** Residents often do not know whether a task belongs to the city, the county or the state (driver's license, deeds, property tax, business registration). No page sorts common tasks by office.
3. **Two contact details disagree.** The county directory lists the County Planning Commission at (304) 291-9570 and the Assessor in Room 315. Our records (from each office's own page) list the Planning Office at 304-284-7302 and the Assessor in Room 335. Logged as a discovery.
4. **State legislators.** Nothing links to the state's own tool for finding your delegates and senator. A neutral link to the Legislature would fit `/who-decides/`.
5. **City policies.** City ordinances are linked from some pages but there is no plain-language index of the most-asked rules (noise, parking, trash carts, rentals). Some exist as their own pages (`/noise/`, `/parking/`, `/renting/`).

**This lane:** fills gaps 1 and 2 with a new page, `/which-office/`, built from existing sourced records and the county directory. Gap 3 is logged in `docs/discoveries/`.

## Local philanthropy

**What the site has.** `/check-a-charity/` (state registration search), `/make-it-better/grants/` (four small project grants), `/volunteer/`, `/start-a-group/`, org records for Your Community Foundation, United Way of Monongalia and Preston Counties, 100+ People Who Care, the Benedum Foundation and the WV Humanities Council. Research in [`local-grants-and-funders.md`](local-grants-and-funders.md) (October 30, 2026) has a full grant calendar.

**Gaps.**

1. **No page for nonprofits looking for grants.** The grant calendar in the research note never reached the site. A small nonprofit cannot see, in one place, which local funders run open rounds and when they open.
2. **How to give locally.** `/check-a-charity/` covers checking a group, but nothing describes the local ways people give: a community foundation's funds, the United Way's campaign, a giving circle. Describe only; never ask anyone to give.
3. **Private foundations with no website.** The largest private funders based here have no website we could find. Their grants show only on their tax returns. Already in the research note; a page could link the public filings, but that waits until gap 1 ships.

**This lane:** fills gap 1 with a page of local funders and when their rounds open, from each funder's own page. Money page, so it waits for David.

## Recycling and safe disposal

**What the site has.** `/recycling/` (an item lookup, pickup days, the county drop-off center, the transfer station, electronics, tires, latex paint, shredding), `/sell-or-donate/`, `/burning/`, `/septic-and-wells/`. Open items: #1449 (curbside sort, blocked), #25 (glass).

**Gaps.**

1. **Old medicines.** Nothing on the site says what to do with unused or expired medicine. The FDA's disposal page says to use a drug take-back site or mail-back envelope first. No current official local page we could read lists a permanent drop box. The WVU Police and DEA pages refuse automated reads, so local boxes need a person to check.
2. **Used needles and other sharps.** Nothing on the site. The FDA says rules depend on where you live and to ask your trash service or health department. No local rule found on an official page.
3. **Batteries.** The page says we could not find a local drop-off. Still open.
4. **Used motor oil, appliances and scrap metal, mattresses, yard waste and leaves.** Not on the page. Each needs an official local source.
5. **Household hazardous waste date.** The page names MUB's yearly day, but there is no next date on the calendar.

**This lane:** fills gaps 1 and 2 with a "Medicines and needles" section on `/recycling/`, from the FDA's own pages. Local drop boxes go in a `needs-verification` issue.

## Community health metrics

**What the site has.** `/how-we-are-doing/` (County Health Rankings numbers for children in poverty and people under 65 without insurance, monthly unemployment, CDC PLACES estimates, a basic budget, school test scores), `/needs/` (the ranked needs register with sources), `/pulse/`. Indicator records are in `content/indicators/`.

**Gaps.**

1. **Crime.** Still "coming" on `/how-we-are-doing/` (#772, waits for David).
2. **High school graduation rate.** Not shown. The state posts it.
3. **Life expectancy, premature death, overdose deaths.** Not shown as indicators, though the needs register cites overdose data.
4. **Unemployment is frozen.** The BLS blocks automated reads, so the number shows the date it was last read (see `docs/operations/automated-reads.md`).

**This lane:** leaves these to the data and cards lane (wave 10), which owns `content/indicators/`. Gaps 2 and 3 are listed here as next work.

## Next work, ranked

1. Small business loans and grants: research official pages, then a section on `/business/` (for David).
2. Batteries, motor oil and appliances: find official local sources, then add to `/recycling/`.
3. High school graduation rate as an indicator.
4. How to give locally: describe the local giving options, from their own pages (for David).
5. A link to the Legislature's "find my legislator" tool on `/who-decides/`.
