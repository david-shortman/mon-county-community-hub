# Small business: loans, a business at home, hiring a first worker

For #1985, sprint wave 20 (#529). Gaps 2 to 5 of the small business part of [the topic depth research](2026-11-03-topic-depth.md#small-business-resources). Every page below was read on November 14, 2026 (Eastern time), by our fetch tool, which checks robots.txt first ([automated reads](../operations/automated-reads.md)). Only official pages of the program or office were used. Nothing here is advice; each program decides who it serves.

## Gap 2: loans and money to start or grow

**What the site already has.** `/business/#money` lists five programs from the Secretary of State's [Funding and Grant Resources](https://sos.wv.gov/business/general-information/funding-grant-resources) page (WVCAP, WV Jobs Investment Trust, WVEDA, the WV Grant Resource Center and county development authorities), as fact records re-read on November 7.

**What is new, from official pages.**

| Program | What its own page says | Source |
|---|---|---|
| SBA microloans | Loans up to $50,000 to start or grow a small business (and some nonprofit child care centers). The average is about $13,000. Made by nonprofit "intermediary" lenders, not SBA. Up to 7 years to repay; rates "generally between 8%-13%". Cannot be used to pay old debts or buy real estate. | https://www.sba.gov/funding-programs/loans/microloans |
| SBA grants | "SBA does not provide grants for starting and expanding a business." SBA's grants go to research and development, exporting and training groups. | https://www.sba.gov/funding-programs/grants |
| SBA loans in general | 7(a), 504 and microloans are made by lenders and backed by SBA. Lender Match connects a business to SBA lenders. | https://www.sba.gov/funding-programs/loans |
| Partner Community Capital (PCAP) | A nonprofit lender (a certified Community Development Financial Institution) that has served all of West Virginia since 2004. Loans start at $5,000. For businesses and nonprofits in West Virginia, North Carolina and nearby Appalachian areas. Owners of 20% or more must co-sign; owners must be 18 or older. Its news page says SBA named it a West Virginia microloan lender. | https://partnercap.org/apply/, https://partnercap.org/what-we-do/, https://partnercap.org/partner-community-capital-named-west-virginia-microloan-lender/ |
| WVCAP technical assistance | The WV Jobs Investment Trust's WVCAP page offers help with accounting, legal work, records and finding money, "through Partner Community Capital". | https://wvjit.wv.gov/wvcap/ |
| Monongalia County Development Authority | Part of the Morgantown Area Partnership. "Helps to attract and retain new and existing businesses through capital financing, tax incentives, employee recruitment and training, sites and buildings". No loan program, amount or form is named on the page. | https://morgantownpartnership.com/economic-development/about/ |
| WV First Small Business Growth Program (SB 1) | A 2026 state law making $100 million in growth capital available through approved private investors, for businesses with under 250 workers. The application window (for investors) closed May 26, 2026. The state says businesses can register interest with their county development authority and check back for investor contacts. Typical deals elsewhere are $1 million to $5 million, so this is for larger growth, not starting out. | https://westvirginia.gov/the-west-virginia-first-small-business-growth-program-sb-1/ |

**Not usable.** WVEDA's own site (`www.wveda.org`) asks robots not to read it (`Disallow: /`). The Secretary of State's description of WVEDA is already on the site. SBA's list of microlenders is a filter page that our tool could not narrow to West Virginia, so PCAP is named from its own page, not from SBA's list. Woodlands Development and Lending's site did not answer.

**Plan.** A short "Small loans" part on `/business/`: SBA microloans, PCAP and SBA's line that it does not give grants to start a business. Those are money facts, so that PR waits for David. SB 1 stays out for now: it has no contacts yet and fits large growth, not first steps.

## Gap 3: SCORE and WVU LaunchLab

Still not readable. `www.score.org` answered 403 to every page (home, `/find-mentor`, `/wv/about`). `launch.wvu.edu`, `launchlab.wvu.edu` and `innovation.wvu.edu` refuse to serve robots.txt (403), so under our rule nothing there is read. The Morgantown Area Partnership's [business resources page](https://morgantownpartnership.com/chamber-of-commerce/business-resources/) lists both ("Experienced business professionals offer guidance to new and existing small businesses"; LaunchLab "helps students, faculty and staff develop and grow their own business ideas"), but that is a third party's description. Left off the site. A person can read the two official pages and add them.

## Gap 4: running a business from home

**City of Morgantown.** The city's [Steps to Starting Your Business](https://www.morgantownwv.gov/247/Steps-to-Starting-Your-Business) page links a [Home Occupation Application Packet](https://www.morgantownwv.gov/DocumentCenter/View/314/Home-Occupation-Application-Packet-PDF). It is a 7-page scan dated September 30, 2013 (PDF metadata). It says:

- Step 1 is Home Occupation Approval from the Planning Department (304-284-7431). Step 2 is the business license, with a copy of that approval, at the Finance Department.
- Class 1 (no customers at the home: online, phone, or work done at the customer's place, or goods sold elsewhere) can be approved by staff. Class 2 (some customers or deliveries) is a conditional use decided by the Board of Zoning Appeals. Anything not clearly Class 1 is Class 2.
- Rules for both: no more than 25% of the floor area, all inside the main building, no outside signs, one business vehicle at most and no trailer, no more than four deliveries or pickups a day, no on-site workers who live elsewhere unless the zoning ordinance allows, renters give the owner written notice, no sexually oriented business.
- No fee is printed in the packet.

The current Planning and Zoning Code was not read in this pass, so the packet could be out of date. The page says so and points to the Planning Division. Logged as a discovery.

**Outside any town.** The County Planning Commission's [FAQ](https://www.monongaliacounty.gov/moncpc/frequently_asked_questions.php) says "Only the West Run Planning District is zoned at this time." Its [application forms page](https://www.monongaliacounty.gov/moncpc/application_forms.php) has Home Occupation Applications for West Run: Level I (up to 2 employees, no more than 1/4 of the home) and Level II (up to 6 employees, no more than 1/3). Staff will review papers before an application at no fee. Outside West Run, no county page names a home business approval.

**Other towns.** Star City, Granville and Westover were not checked for home business rules in this pass; `/business-by-town/` covers their licenses.

## Gap 5: hiring a first worker

**State unemployment tax** (WorkForce West Virginia):

- Apply for an unemployment compensation account on the One Stop Business Portal and fill out the Employer's Initial Statement, which "determine[s] UI tax liability". A new business gets a rate once it applies. ([FAQ](https://workforcewv.org/businesses/unemployment-tax-information/frequently-asked-questions/), [employer resources](https://workforcewv.org/businesses/unemployment-tax-information/employer-resources/))
- Reports and payments are due April 30, July 31, October 31 and January 31, filed online with wages and each worker's job title. ([tax filing and reporting](https://workforcewv.org/businesses/unemployment-tax-information/tax-filing-reporting/))
- "The Unemployment Compensation Law has no provision for the waiver of penalties or interest." Compliance and Enforcement Unit: 304-558-2451, uctaxunit@wv.gov.
- No page read here states the new-employer rate or the taxable wage base, so neither is on the site.

**Workers' compensation** (WV Offices of the Insurance Commissioner):

- "All WV employers are statutorily required to maintain workers' compensation insurance coverage." The Employer Coverage Unit reviews exemption requests: 304-414-0539, OICEmployerCoverage@wv.gov. ([Employer Coverage](https://www.wvinsurance.gov/EmployerCoverage.aspx))
- "Over 350 carriers" sell it in West Virginia. ([Workers' Compensation](https://www.wvinsurance.gov/Workers-Compensation))
- Who can be exempt is in an information letter (PDF) not read in this pass, so the page does not list exemptions.

**Shipped** on `/start-a-business/` as two new parts, "Running a business from your home" and "Hiring your first worker", with fact records in `content/facts/business/`.
