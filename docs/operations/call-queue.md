# The call queue

The plan for #156: one place that lists every phone call that would settle something on the site, how often places get a call, what to say, and how to write down the answer. **Making calls is David's call** (#165: who calls, and from what number). Nothing here contacts anyone. Claude sessions only keep this list current.

Started 2026-11-01 (sprint wave 9, #529). Cost: $0 with a phone David already has; a shared project number would be an outside account and is part of #165.

## Where calls come from

| Source | What it holds | How it gets here |
|---|---|---|
| Open `needs-verification` issues | A fact no current official page states, or pages that disagree | Verification sweeps write a dated list in this folder (`call-list-YYYY-MM-DD.md`, one file per sweep, so sweeps never edit the same file). Whoever refreshes this queue merges those lists and drops issues that closed. |
| `npm run call-queue` in `site/` (#164) | Listings on the site whose sources a robot cannot read, places with no recent activity, and anything confirmed by phone before (it stays on the rotation) | Run it when refreshing the queue. On 2026-11-01 it lists one place: Rock Forge Neighborhood House, 304-292-3286. |
| Phone-only food sites (#156 comment, `content/watch/food.yaml`, `kind: none`) | Pantries and meals with no web page that gives hours | Listed below. They are not listings yet; a confirmed call turns one into a listing with `phone_confirmed`. |
| #932 | Pantry and meal hours that sources disagree on | Folded into the food section below. |

## How often

Copied from how 211 call centers keep their listings current (the Inform USA standard is at least once a year):

- **Food, shelter and crisis listings: once a month.** These change most, and a wrong hour costs the most.
- **Everything else on the rotation: once a year,** or sooner when the site's out-of-date note is near (6 months after the last check).
- **A `needs-verification` question: once.** After the answer is on the issue, it leaves the queue.
- **No organization more than once a month.** Batch every open question for that organization into one call; the sections below are already grouped that way.
- **Start small:** about 10 calls a week, food and shelter first (the pace suggested in #165).

## The script

Short, under 2 minutes, the same every time. Read the number off the organization's own page right before calling, in case it changed.

> Hi, my name is ___. I help with Everything Morgantown, a free community guide to local help at everythingmorgantown.org. We list your [program] and want to make sure it is right. Do you have a minute for a few quick questions?
>
> 1. What days and hours is it open now?
> 2. Who can use it, and what should people bring?
> 3. What is the best public phone number for people to call?
> 4. If something changes later, how would you like to tell us: a call, an email, or our online form?
>
> [Any open questions for this organization from the list below.]
>
> Thank you. If you would rather we not call again, just say so and we will not.

For a `needs-verification` question, ask only that question, after the first line. Do not read our page out loud or argue with an answer: write down what they say, and the site cites it as "confirmed by phone with <office>."

## Courtesy rules

- Say who you are and why you are calling. Never pretend to be a client.
- Keep it short. If they are busy, ask when is a better time, or skip to next month.
- **No recording, notes only.** West Virginia allows one-party recording, but Pennsylvania next door requires everyone's consent, so the simple rule is never record.
- **Never write down the name of the person who answers,** or anything about them. Write the office: "front desk", "pantry coordinator".
- If they ask not to be called, mark it on the issue or the record's notes and take them off the queue.
- No calls to private individuals or personal numbers. Every number in the queue is printed on the organization's own page or an official directory.

## The call log

Write the answer where the work is, not in a separate log:

- **A `needs-verification` question:** a comment on the issue:
  ```
  Called <office> at <number> on <YYYY-MM-DD>. <Their answer, in plain words.> Caller: <initials>.
  ```
  Then a build session adds it to the site with "confirmed by phone with <office>, <date>" and closes the issue.
- **A listing on the rotation:** set these on the record (schema in `content/README.md`, "Confirmed by phone and the call queue"), and fix anything that changed:
  ```yaml
  phone_confirmed: 2026-11-02   # Morgantown date of the call
  phone_confirmed_by: DS        # optional; the caller's initials
  ```
  The card then says "Confirmed by phone on <date>." and the listing stays on the monthly or yearly rotation.
- **No answer, or a full voicemail:** a one-line comment on the issue ("No answer, 2026-11-02"). Try again next week. After three tries, note it and move on.

Organization facts only, never anything about the person who answered.

## The queue on 2026-11-01

Merged from [`call-list-2026-10-31.md`](call-list-2026-10-31.md) (sweeps 1 to 3) and [`call-list-2026-11-01.md`](call-list-2026-11-01.md) (sweep 4). Only issues still open on 2026-11-01 are listed; questions for issues that have since closed (#375, #376, #377, #416, #600, #601, #798, #900, #1209) are dropped. Numbers are as printed in those lists, which name the page each came from. The dated lists keep the full wording and sources.

**Time-sensitive first:** Thanksgiving and holiday help (#1015), the Moonlight Market date (#681), Christmas at the Barn (#704, by November 5), WVU closing dates (#1195, before November 3), and fall leaf pickup (#823).

### 1. Food, holiday help and phone-only pantries (monthly)

- **Salvation Army Morgantown, 304-296-3525:** pantry days, times and address; is Sally's Kitchen free and open to anyone; 2026 Angel Tree dates. (#932, #885, #1015)
- **Scott's Run Settlement House, 304-435-5098:** each site's hours, how to book a pantry pickup, which site does baby pantry pickups, and the Thanksgiving basket deadline and pickup date. (#932, #1015, #569)
- **Christian Help, 304-296-0221:** prescription vouchers (who qualifies, how to ask); any toy sign-up after October 30. (#374, #1015)
- **Starting Points pantry, 304-680-0590:** walk-in Wednesdays at 901 Mylan Lane, or appointment only? (#932)
- **St. Ursula, 304-599-3822:** are pantry appointments 1:00 to 4:30 on the first three Wednesdays? (#932)
- **Pantry Plus More, 304-241-4751:** Thanksgiving boxes in 2026? (#1015)
- **Wesley UMC, 304-292-9485:** a 2026 community Thanksgiving dinner? (#1015)
- **Food sites with no web page that gives hours** (from #156; numbers to be found on an official page or the United Way food list before calling): Catholic Charities Morgantown pantry, Covenant Evangelical Methodist (Greenbag Road), Canyon Presbyterian, Rock Forge Presbyterian, Wadestown food pantry, Clay-Battelle Senior Center meals, Circle of Friends, Sarah's Table, Food Not Bombs Morgantown, Morgantown Mutual Aid Fair. Caritas House, Community Action (High Street) and Hope Farm may no longer run pantries; their old web addresses are parked.

### 2. Health, aging, disability and families

- **Monongalia County Health Department:** main line 304-598-5100, do interpreters cost anything (#1194); clinic 304-598-5119, adult flu and COVID shot prices with no insurance and the lowest sliding fee (#382); Environmental Health 304-598-5131, the 2026-27 ABCC add-on fee, cottage food that is not potentially hazardous, and who a renter outside town limits calls about unsafe conditions (#1271, #1232, #564).
- **Senior Monongalians, 304-296-9812:** main line vs ride line (304-685-4502 and 304-290-7661 also appear); where the Core site lunch is; do home-delivered meals cost anything; caregiver training, support groups or respite beyond FAIR. (#559, #1026)
- **WV Bureau of Senior Services, 1-866-981-2372 (some listings say 866-987-2372):** is this the Aging and Disability Resource Network line, and which office and Area Agency on Aging serve Mon County? (#559, #577)
- **Westside Senior Center, 304-296-6583:** which email is current? (#760)
- **Mountain Line, 304-291-7433 (ADA office 304-296-3680):** do seniors ride free anywhere; ADA paratransit apart from route deviations, and the reduced fare; the Volunteer-Driver and Travel Training programs; what a Gold Card or Medicare card holder pays on a $1.00 route. (#559, #577, #983)
- **Starting Points, 304-599-5466:** home visiting (MIHOW), playgroup and Happy School days and times. (#569)
- **Child Care Resource Center, 304-292-7357:** intake steps and papers to bring; how many days to decide an application, and how long a family has to ask for a hearing. (#569, #1223)
- **WV maternal and child health line, 1-800-642-8522:** does it reach Help Me Grow, and who provides Right From The Start home visits here? (#569)
- **WVU Medicine:** 1-855-WVU-CARE, the outpatient lactation clinic and 2026 car seat checks (#569); financial counseling 304-598-6260, is an assistance approval good for 12 or 6 months (#1012).
- **WV Tobacco Quitline, 1-800-784-8669 (1-800-QUIT-NOW):** free patches, gum or lozenges for a caller without Medicaid: how many weeks? (#380)
- **Legal Aid of West Virginia helpline, 866-255-4370:** who runs the long-term care ombudsman for Mon County; what notice a landlord must give before raising rent, and which page renters should see. (#559, #564)
- **BMS, CDCSP, 304-356-4867:** is the age limit under 19 or under 18? (#1225)
- **WV Parent Training and Information, 304-472-5697:** office and mailing address; are trainings free to parents? (#1225)
- **WVU Center for Excellence in Disabilities, 304-293-4692:** are Paths for Parents, Parent to Parent and Sibshops free? (#1225)
- **Arnettsville branch library, 304-278-2021:** is Senior Lunch and Learn free? (#1196)
- **Special Olympics WV, 304-345-9310:** does Monongalia County have an active program? (#577)

### 3. Benefits, housing, money and courts

- **DoHS Client Services, 1-800-642-8589:** LIEAP hearing deadline (60 days from the notice or 90 from the action); Emergency LIEAP's 5 days (calendar or working, counted from what). (#1164)
- **Monongalia County DoHS office, 304-285-3175:** how to ask for an interpreter, and is it free? (#1323)
- **Fairmont-Morgantown Housing Authority, 304-363-0860:** days to ask for a review or hearing after a denial; days to report a change; office hours. Housing counselor, ext. 127: is delinquency or default counseling free, in person or by phone? (#1213, #1236)
- **WV Housing Development Fund, 800-933-1272:** any statewide help now for homeowners behind on a mortgage that is not a WVHDF loan? (#1236)
- **WorkForce WV:** Morgantown office 681-404-6377 (state line 1-800-252-5627), is it the local line, walk-in hours, and the address ZIP (#379); Board of Review 304-558-2636, can an appeal be filed by mail, fax or online (#1165).
- **Dollar Energy Fund, 800-683-7036 and 888-282-6816:** which number should a Mon Power customer in Mon County call? (#1010)
- **Public Service Commission, 1-800-344-5113:** which water and gas utilities, public service districts and certified trash haulers serve Mon County outside the city and town systems? (#524, #1065)
- **MUB customer service, 304-292-8443:** how to get water turned back on after a shutoff, and is there a fee? (#1193)
- **Circuit Clerk, 304-291-7240:** sheriff service costs for a family court petition and a subpoena; copy fee; local family court forms; end-of-case costs in a domestic violence case. (#1219, #1234)
- **Magistrate Clerk, 304-291-7296:** civil filing fees, sheriff service cost, counter hours, notary; reaching a magistrate after hours for a protective order; which office takes the appeal of a denied petition. (#1023, #1234)
- **BCSE Monongalia office, 304-285-3218:** hours, walk-ins, and the ZIP code. (#1219)
- **Division of Corrections and Rehabilitation, 304-558-2036:** how a person gets the free temporary ID before release, and do regional jails give it? (#1228)
- **Clarksburg Parole Office, 304-627-2308:** do Mon County parolees ever report in Morgantown? (#1228)

### 4. City, county, towns and schools

- **City of Morgantown, City Hall, 304-284-7405:** starting trash pickup and who bills (#525); which office takes floodplain permits (#553); MOTO tool pickup location (#681, #660, #1027; MOTO line 304-241-3116); the Municipal ID program (#622); the ARPA facade grant (#700); the Bicycle Board (#630); open burning and fire pits in city limits (#1118).
- **City of Morgantown, other lines:** Code Enforcement 304-284-7401, which number checks rental registration (#564); Finance 304-284-7401 and 304-284-7423, B&O rates and due dates, the license fee, and cottage food sellers (#638, #603, #1232); Streets 304-291-7465, fall leaf pickup and bagging (#823); Police non-emergency 304-284-7522 ext. 0, noise complaints (#1113); Parking Authority 304-284-7435, blue curb permit hours (#1189).
- **Main Street Morgantown, 304-292-3311:** a downtown facade grant or loan now; the 2026 and 2027 Arts Walk dates. (#700, #653)
- **Monongalia County Commission office, 304-291-7257:** a county veterans service office (#585); the Abandoned and Dilapidated Property agency's start year (#1189).
- **County Clerk, 304-291-7230:** the next parks levy vote (#757); certificates at the counter, notary (#1025, #1023); 2026 poll worker pay (#1133).
- **Assessor, 304-291-7222:** value review deadline and the 2027 Board of Review (#660); dog tag fees (#1024); homestead approval letters and the appeal deadline, ext. 2012 (#1223).
- **Canine Adoption Center, 304-291-7267 option 2:** fees, last appointment, address, dangerous dog reports. (#1024)
- **Solid Waste Authority, 304-292-3801:** can it tell a resident which company picks up trash at their address? (#901)
- **Emergency Management, 304-599-6332:** can residents sign up for county alerts, and where (#727); who sponsors CERT and when are the next classes (#609).
- **Monongalia County Schools, 304-291-9210:** the religious exemption letter (#387); Early Head Start (#417, ext. 1756); the English learner program and interpreters for parents (#1324).
- **Town of Blacksville, 304-432-8205:** water, non-emergency police, and where council posts agendas and meets. (#674, #860, #1172)
- **Town of Granville, 304-599-5080:** rental inspections and complaints; where agendas and minutes are posted. (#564, #1172)
- **City of Westover, 304-296-6860:** rental registration and complaints. (#564)
- **Town of Star City, 304-599-3550:** is the farmers market still held? (#1027)
- **BOPARC, 304-296-8356:** 2027 summer camps; refund fee; community garden plots. (#613, #957, #1027)
- **Morgantown Public Library, 304-291-7425:** does the Seed Preservation Library still run? (#1027)
- **Aull Center, 304-292-0140:** free public Wi-Fi? (#885)
- **Mylan Park, 304-933-2782:** adult and child aquatic day pass prices. (#630)
- **M-SNAP ReTails, 304-241-1483:** store days and hours. (#680)
- **Catholic Charities WV, 304-343-1036:** is refugee resettlement taking new arrivals in Morgantown? (#768)
- **MTEC, 304-291-9226:** ESL schedule and any cost. (#1325)
- **WV 211, the library and Health Right:** do they offer interpreters or a language line? (#1325)

### 5. State offices

- **WV DMV, 1-800-642-9066 (Morgantown office 304-558-3900):** adult ID card fee, and how long a mailed card takes (#1025); does the Morgantown office handle out-of-state license and title transfers (#622)?
- **WV Secretary of State Elections, 304-558-6000:** can an out-of-state college student register with a dorm or off-campus Morgantown address? (#598)
- **Vital Registration, 304-558-2931:** which ID list is current? (#1025)
- **WV Department of Agriculture, 304-558-2227 or cottagefood@wvda.us:** online orders and delivery for potentially hazardous cottage food; does the label list apply to baked goods? (#1232)

### By email (no call)

- **Morgantown Moonlight Market** (email on its /apply page): is the November market on November 7 or 14, and the hours? (#681)
- **BMS SUD waiver mailbox, bmssudwaiver@wv.gov:** have Medicaid reentry services started, and how does a released person restart suspended Medicaid? (#1228)
- **Goodwill of Southwestern PA, careerstart@goodwillswpa.org:** are career services offered in Morgantown? (#644)

### Browser checks (a person reads a page; no call)

These sites refuse automated reads or load only by script. The dated lists name each page: #381, #704, #740, #553, #772, #872, #898, #823, #1024, #1025, #1012, #1026, #908, #932 (ccwva.org/locations), #885, #1195, #1165, #1223, #1225, #1236, #1118, #1113, #1193, #1132, #1189, #1172, #1323 (WV PATH help page), #1324 (Policy 2417), #417 (Early Head Start locator), #525 (Republic Services), #552 and #613 (WVU Extension, BOPARC camp pages), #598 and #622 (WVU pages, tourism site), #559 (Bureau of Senior Services site), #603 (Contractor Licensing Board), #1271 (Health Department PDFs), #680 (Shiny Dome Records), #569 (child care provider search).

### Not yet merged into this queue

Open `needs-verification` issues with no call or browser step written yet: #418, #592, #629, #665, #1303, #1312. Read each before the next refresh.

## Refreshing the queue

About once a week, or after a verification sweep:

1. Merge new dated call lists into the sections above, by organization.
2. Drop questions whose issues closed (`gh api "repos/david-shortman/mon-county-community-hub/issues?labels=needs-verification&state=closed"`).
3. Run `npm run call-queue` in `site/` and add any listing it shows.
4. Update the date in "The queue on <date>".
