# Urgent care clinic addresses and hours are not on a page we can read, and no list shows doctors taking new patients

- **Found:** 2026-11-14, while building `/sick-or-hurt/` for #475 (rank 7) and #21.
- **What we found:**
  - WVU Medicine's urgent care page says no appointment is needed and "Most of our locations are open seven days a week", but it sends people to a location search that loads by script. Older addresses for the Suncrest Towne Centre and Morgantown urgent care pages (`/urgentcare/suncrest`, `/locations/suncrest-towne-centre/`, `/wvum-services/urgent-care/west-virginia/morgantown`) now answer "Page not found". So the site links to the search and does not list a clinic address or hours.
  - Mon Health's home page lists walk-in care with hours for its Westover/Gateway and Cheat Lake offices, and its emergency room. These are on the new page.
  - Neither WVU Medicine's nor Mon Health's doctor search says which primary care providers are taking new patients. The page tells people to ask when they call.
  - The federal Poison Help page (`poisonhelp.hrsa.gov`) refused our read with "Access Denied". The West Virginia Poison Center's own pages give the same 1-800-222-1222 number, so we used those. Neither page says the call is free.
- **Evidence:** https://wvumedicine.org/our-care/urgent-care/ and https://www.monhealth.com/, read 2026-11-14; the old WVU Medicine addresses above answered 404 on 2026-11-14; https://wvpoisoncenter.org/contact-us, read 2026-11-14.
- **Why it matters:** a person with a sick child at night wants the nearest clinic's address and closing time on one screen. Today that takes a script-driven search or a phone call.
- **Who keeps it:** WVU Medicine (its location pages), Mon Health and WVU Medicine (doctor searches).
- **Status:** open. Human follow-up: open the WVU Medicine location search in a browser, filter to Urgent Care in Morgantown, and paste each clinic's address, hours and URL into a needs-verification issue so a build session can add them.
