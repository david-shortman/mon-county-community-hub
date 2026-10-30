export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const u = (p) => new URL(`${base}${p}`, site).href;
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
- [Families and kids](${u('/families-and-kids/')}): WV Birth to Three for children under 3, Pre-K and Head Start applications, free playgroups and a baby pantry at Starting Points, and library story times
- [Veterans](${u('/veterans/')}): the Monongalia County VA Clinic and Morgantown Vet Center on Commerce Drive, the Veterans Crisis Line, and VA help for veterans losing housing
- [Work and learning](${u('/work-and-learning/')}): WorkForce West Virginia job help in Westover, and free reading, writing and English lessons for adults
- [Disability and aging](${u('/disability-and-aging/')}): LiveAbility independent living help, DRS job help for people with disabilities, and WV SHIP Medicare help
- [Medicaid waivers](${u('/medicaid-waivers/')}): a plain guide to West Virginia's four Medicaid home care waivers (ADW, IDDW, TBIW, CSEDW): who each is for, how to start, who to call
- [Living here](${u('/living-here/')}): pick what is going on (moving here, trash pickup day, recycling drop-off, tires or electronics) and get local steps with phone numbers and sources
- [Family and life changes](${u('/family/')}): pick what is going on (a baby or young child, a job or training, reading or English lessons, veterans' health care, counseling or housing) and get local steps with phone numbers and sources
- [Moving here: start power, water, gas and trash](${u('/moving-here/')}): how to start service with Mon Power, the Morgantown Utility Board and Hope Gas, town trash pickup in Star City and Granville, deposits and fees, and who to ask
- [Is my home in a flood zone or a slide area?](${u('/flood-zone/')}): check an address on the WV Flood Tool, the FEMA flood map and the WV Landslide Tool, flood insurance basics (most home and renters insurance does not cover floods, 30 day wait), and the county floodplain permit
- [Trash, recycling and drop-off](${u('/recycling/')}): pickup days, what goes in the curbside bin, and where to take hard items
- [About](${u('/about/')}): how the project works and its rules
- [Corrections](${u('/corrections/')}): every fix to a fact, link or out-of-date detail, newest first
- [The idea](${u('/the-idea/')}): what the project is trying to do, in four parts, each with a before, an after, and links to check it
- [For groups and helpers](${u('/partners/')}): how a group can fix or remove its listing, how to reuse the data (CC BY 4.0 content, MIT code, calendar feed), and what the project will and won't do
- [Hard questions](${u('/hard-questions/')}): straight answers about who runs the site, why it uses AI, how facts get checked, who pays, and where it falls short today
- [Make it better](${u('/make-it-better/')}): ways to improve Morgantown and Mon County, from reporting a problem to serving on a city board
- [Fix what you see: who to tell](${u('/make-it-better/report/')}): the office that handles graffiti, illegal dumping, litter, potholes (city street or state road), broken sidewalks, trees and run-down buildings, inside or outside city limits

## Data

- [Open data](${u('/data/')}): how to reuse the listings, the license (CC BY 4.0) and how to cite
- [API catalog](${u('/api/v1/index.json')}): JSON index of every data file, with counts, license and build time
- [OpenAPI description](${u('/api/v1/openapi.yaml')}): every field in the JSON files
- [Groups and offices](${u('/api/v1/orgs.json')}), [programs and services](${u('/api/v1/resources.json')}), [deadlines and dates](${u('/api/v1/calendar.json')}), [corrections](${u('/api/v1/corrections.json')}): each record lists its sources and checked dates

## Notes for AI tools

- Please link to the source listed on each item, not only to this site.
- The project is neutral and nonpartisan. It describes; it does not recommend.
- Code, data, and decisions are public: https://github.com/david-shortman/mon-county-community-hub
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
