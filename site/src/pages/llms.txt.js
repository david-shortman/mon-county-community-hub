import { loadPlaces } from '../lib/places.mjs';

export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const u = (p) => new URL(`${base}${p}`, site).href;
  // One line per community center page (#463), built from content/places.
  const centers = loadPlaces().map((p) => `- [${p.name}](${u(`/community-centers/${p.slug}/`)}): ${p.community}. ${p.story}`).join('\n');
  const body = `# Everything Morgantown

> Plain-language help for life in Morgantown and Monongalia County, WV. An open project that points to the nonprofits, government offices, and community groups already doing the work. Every fact links to its source and says when it was last checked. Dates and details can change, so confirm with the source before you act.

## Pages

- [Home](${u('/')}): "What do you need help with?": 211 and 988 for help right now, search, and need buttons for shelter, food, bills, rent, shots, dates and recycling
- [All topics](${u('/topics/')}): every page, sorted into five doors named for what is going on in a person's life (Get through this month, Get care, Living here, Family and life changes, Your community), plus A to Z
- [Search](${u('/search/')}): search every page; runs in the browser, nothing is sent to the site
- [Deadlines and dates](${u('/calendar/')}): application windows, deadlines, and community dates
- [Calendar feed (iCalendar)](${u('/calendar.ics')}): the same dates, for calendar apps
- [This month in Mon County](${u('/calendar/month/')}): the next 30 days from the calendar on one page you can print
- [Where to stay tonight](${u('/stay-tonight/')}): emergency shelter, a 24-hour hotline, and 211
- [Help paying a utility bill](${u('/utility-bills/')}): who to call first and programs that help with heat, water and electric bills
- [Get through this month](${u('/money/')}): pick what is going on (a utility or other bill, short on food, behind on rent, cash fast or a payday loan, free tax help) and get local steps in order, with phone numbers and sources; also the scam warning
- [Food help](${u('/help/food/')}): two questions (when you need food, and whether you are a WVU student) leading to sourced options
- [Food today or this week](${u('/help/food/today/other/')}): 211, Scott's Run Settlement House, and upcoming free food dates
- [Food today for WVU students](${u('/help/food/today/student/')}): The Rack student food pantry first, then 211 and other options
- [Food today: WVU student question](${u('/help/food/today/')}): the second food question
- [Help buying groceries every month](${u('/help/food/monthly/')}): SNAP: you may qualify; apply on WV PATH or call DoHS
- [Apply for SNAP (food stamps)](${u('/snap/')}): apply online at WV PATH, the state's free site, and the DoHS phone number
- [Get care](${u('/care/')}): pick what is going on (a flu or COVID shot, a dentist, turning 65, quitting tobacco, staying healthy) and get local steps in order, with phone numbers, costs and sources
- [Flu and COVID shots](${u('/flu-shots/')}): book at the Monongalia County Health Department; who gets them free
- [Staying well](${u('/staying-well/')}): a simple yearly list (flu shot, checkup, dental, moving more, help to quit tobacco, 988) with costs and local places
- [Dentist or prescriptions](${u('/dental-and-prescriptions/')}): a dentist with no dental insurance (health department dental clinic, WVU Dental) and help paying for medicine (Milan Puskar Health Right free clinic)
- [Turning 65 or on Medicare](${u('/turning-65/')}): when to sign up, visits and shots Medicare pays for, free help from WV SHIP, help paying Medicare costs
- [Diabetes, blood pressure or weight](${u('/diabetes-and-weight/')}): health department dietitians with a sliding fee, and free diabetes and heart clinics for Health Right patients
- [Ride to a medical visit](${u('/medical-rides/')}): Medicaid and WVCHIP rides through Modivcare (book 5 business days ahead), and Mountain Line bus routes to Ruby Memorial, Mon General and the health department, with half fares
- [Families and kids](${u('/families-and-kids/')}): WV Birth to Three for children under 3, Pre-K and Head Start applications, free playgroups and a baby pantry at Starting Points, and library story times
- [Veterans](${u('/veterans/')}): the Monongalia County VA Clinic and Morgantown Vet Center on Commerce Drive, the Veterans Crisis Line, and VA help for veterans losing housing
- [Work and learning](${u('/work-and-learning/')}): WorkForce West Virginia job help in Westover, and free reading, writing and English lessons for adults
- [Contractor and trade licenses](${u('/contractor-license/')}): where WV contractors, plumbers, HVAC technicians and electricians get licensed, the Morgantown business license and permit portal for work in city limits, and how to look up a contractor's license or file a complaint with the WV Contractor Licensing Board
- [Disability and aging](${u('/disability-and-aging/')}): LiveAbility independent living help, DRS job help for people with disabilities, and WV SHIP Medicare help
- [Medicaid waivers](${u('/medicaid-waivers/')}): a plain guide to West Virginia's four Medicaid home care waivers (ADW, IDDW, TBIW, CSEDW): who each is for, how to start, who to call
- [Living here](${u('/living-here/')}): pick what is going on (moving here, trash pickup day, recycling drop-off, tires or electronics) and get local steps with phone numbers and sources
- [Family and life changes](${u('/family/')}): pick what is going on (a baby or young child, a job or training, reading or English lessons, veterans' health care, counseling or housing) and get local steps with phone numbers and sources
- [Moving here: start power, water, gas and trash](${u('/moving-here/')}): how to start service with Mon Power, the Morgantown Utility Board and Hope Gas, town trash pickup in Star City and Granville, deposits and fees, and who to ask
- [Get weather and emergency alerts](${u('/weather-alerts/')}): official sources only: phone Wireless Emergency Alerts, NWS Pittsburgh and NOAA Weather Radio for Mon County, City of Morgantown Notify Me, WVU Alert, WV 511 road alerts, statewide school closings, and FirstEnergy outage texts
- [Is my home in a flood zone or a slide area?](${u('/flood-zone/')}): check an address on the WV Flood Tool, the FEMA flood map and the WV Landslide Tool, flood insurance basics (most home and renters insurance does not cover floods, 30 day wait), and the county floodplain permit
- [Trash, recycling and drop-off](${u('/recycling/')}): pickup days, what goes in the curbside bin, and where to take hard items
- [Thrift and resale shops](${u('/thrift-shops/')}): secondhand shops by area, what each sells, which buy from you, and which fund a local cause
- [Sell, donate or give away your stuff](${u('/sell-or-donate/')}): for clothes, kids' gear, furniture, books, electronics, tools, paint and building materials, where each can be sold, donated, given away or recycled
- [Markets and sales coming up](${u('/markets/')}): craft markets and card shows in the next 30 days, the farmers market, yearly sales, the nearest flea markets, and how to sell at a market
- [Grow food and flowers](${u('/grow/')}): pick what you hope to do (grow food on a budget, sell what you grow, a small farm) and get local steps with phone numbers and sources
- [Sell what you grow](${u('/sell-what-you-grow/')}): who sets the rules for selling produce, canned foods and plants at a Mon County farmers market, with links to the county health department and WV Department of Agriculture rules
- [Your community](${u('/community/')}): pick what fits (a community center near you, a community dinner, a hall to rent, joining a center, making your neighborhood better) and go straight to the page
- [Community centers and halls](${u('/community-centers/')}): community centers, senior centers and halls across Mon County, grouped by part of the county, with dinners and events, halls to rent, and how to join
- [Compare halls](${u('/community-centers/halls/')}): halls, rooms and pavilions to rent, side by side: seats, kitchen, price, deposit and how to book, with the date each price was checked
${centers}
- [City meetings: agendas and minutes](${u('/meetings/')}): posted agendas for coming Morgantown City Council and city board meetings, and minutes from the last 60 days, read daily from the city's AgendaCenter
- [About](${u('/about/')}): how the project works and its rules
- [Corrections](${u('/corrections/')}): every fix to a fact, link or out-of-date detail, newest first
- [The idea](${u('/the-idea/')}): what the project is trying to do, in four parts, each with a before, an after, and links to check it
- [For groups and helpers](${u('/partners/')}): how a group can fix or remove its listing, how to reuse the data (CC BY 4.0 content, MIT code, calendar feed), and what the project will and won't do
- [Make a list for someone](${u('/make-a-list/')}): a helper picks up to 6 places and adds a note, then prints or texts a one-page list; picks live only in the web address
- [Hard questions](${u('/hard-questions/')}): straight answers about who runs the site, why it uses AI, how facts get checked, who pays, and where it falls short today
- [Make it better](${u('/make-it-better/')}): ways to improve Morgantown and Mon County, from reporting a problem to serving on a city board
- [Serve on a city board](${u('/make-it-better/boards/')}): city boards that shape how Morgantown looks and feels (Urban Landscape Commission, Tree Board, Cultural Arts, Historic Landmarks, Planning, and more), what each does, when it meets, open seats from the city's vacancy list, and how to apply
- [Get money for a project](${u('/make-it-better/grants/')}): Morgantown Mosaic neighborhood grants, state Community Tree Grants, Organizational Arts Grants and state arts grants: who can apply, how much, match, and the next date (or that it is not announced)
- [Adopt a street, spot, stream or trail](${u('/make-it-better/adopt/')}): Morgantown's Adopt-A-Street, the state's Adopt-A-Highway, Adopt-A-Spot and Adopt-A-Stream, and BOPARC trail cleanups compared: what you adopt, how long, how often you clean, what you get, and how to start
- [Have your say at a public meeting](${u('/have-your-say/')}): when Morgantown City Council, the Monongalia County Commission, the Board of Education, BOPARC and the Planning Commission meet, how public comment works at each (from official pages), and where agendas are
- [Older adults and retirees](${u('/for/older-adults/')}): a starting page that links to Medicare, care at home, food and bill help, veterans help, and ways to stay involved
- [Parents of babies and toddlers](${u('/for/parents-young-kids/')}): a starting page that links to child development help, Pre-K and Head Start, playgroups, checkups and food help
- [New to Mon County](${u('/for/new-to-mon-county/')}): a starting page that links to starting utilities, trash day, care, kids, work and English lessons, and this month's events
- [People with disabilities and caregivers](${u('/for/disability-and-caregivers/')}): a starting page that links to independent living, care at home through Medicaid, job help and health costs
- [Free car seat checks](${u('/car-seat-checks/')}): the two child car seat fitting stations the WV DMV lists for Mon County (Sheriff's Department, WVU Medicine Children's), free, by appointment

## Data

- [Open data](${u('/data/')}): how to reuse the listings, the license (CC BY 4.0) and how to cite
- [API catalog](${u('/api/v1/index.json')}): JSON index of every data file, with counts, license and build time
- [OpenAPI description](${u('/api/v1/openapi.yaml')}): every field in the JSON files
- [Groups and offices](${u('/api/v1/orgs.json')}), [programs and services](${u('/api/v1/resources.json')}), [deadlines and dates](${u('/api/v1/calendar.json')}), [needs register](${u('/api/v1/needs.json')}), [corrections](${u('/api/v1/corrections.json')}): each record lists its sources and checked dates
- [When plans and budgets get decided](${u('/make-it-better/when-it-gets-decided/')}): Morgantown's budget year, the March levy window in state law, the 2027-2031 capital plan lines for Mosaic, a downtown master plan and wayfinding, the comprehensive plan, and how to comment

## Notes for AI tools

- Please link to the source listed on each item, not only to this site.
- The project is neutral and nonpartisan. It describes; it does not recommend.
- Code, data, and decisions are public: https://github.com/david-shortman/mon-county-community-hub
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
