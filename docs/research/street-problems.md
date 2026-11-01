# Street problems: who fixes what, and how fast

Last checked: 2026-11-01 (Morgantown date)
For issue #86, sprint wave 9 (#529). Research only: no outreach. Every fact below was read on the linked page on the checked date. The resident guide built from this is `/make-it-better/report/` (#550).

## Who owns the road decides who fixes it

There are two road owners a resident in Mon County is likely to deal with: a town, or the state.

- **The state owns most roads.** The WV Division of Highways (DOH) page lists "38,844 miles of public roads (2024 Public Certified Mileage)": "34,940 miles of state owned highways, 914 miles of federally owned roads, and 2,990 miles of municipally owned roads." https://transportation.wv.gov/agencies/highways
- That list has no county-owned roads. Outside a town, a public road is almost always a state road. We did not find a Monongalia County office that takes pothole reports.
- **Inside a town,** some streets belong to the town and some are state roads that pass through it. The state's "Identify State Roads Near an Address" map answers this for one address: https://experience.arcgis.com/experience/2917da07ad1d4900bb4e372ca6527126/page/Page (linked from https://transportation.wv.gov/).

## Where to report

| Road | Where | Hours | Source |
|---|---|---|---|
| City street in Morgantown | Morgantown 311 (SeeClickFix): app, web, or 304-284-7405. Category "Street Maintenance & Potholes" | Phone Monday to Thursday, 7 a.m. to 5:30 p.m. | https://www.morgantownwv.gov/428/Service-Request |
| State road (anywhere in the county) | DOH Request for Road Repair form (SWAT), or District 4 in Clarksburg, 304-842-1500 | "Requests are handled Monday through Friday, 7:30 AM to 4:00 PM" | https://webapps.transportation.wv.gov/swat/, https://transportation.wv.gov/agencies/highways/districts/district-four |
| Street in another town (Westover, Star City, Granville and others) | That town's office | Varies | `/moving-here/` town picker |

Notes from the official pages:

- District 4 serves Doddridge, Harrison, Marion, Monongalia, Preston and Taylor counties.
- The SWAT form "should NOT be used to report any kind of highway emergency or criminal activity. Report highway emergencies to 911 or the local State Police." It asks for a name, email, mailing address and home phone.
- Morgantown 311 is public: "The description entered will be visible to the public. Your display name will also be visible unless you choose to submit as Anonymous. Your email address will never be displayed publicly."
- 1-833-WV-ROADS, mentioned in older news stories, is not listed on any current WVDOT page we read, so it stays off the site (see the #86 comments).

## How fast: what the public record can say

**Morgantown 311.** Requests are public through the SeeClickFix API. The weekly totals job (`site/scripts/check-311.mjs`, `.github/workflows/311-totals.yml`, built in #881) counts requests by status and category, never single requests. Its first run is on #1078. Limits found so far:

- SeeClickFix says "Issues are Archived after being Closed for 7 days" (https://dev.seeclickfix.com/v2/issues/changing_status), so "archived" counts as closed. Medians must include archived requests, or they only describe the last week.
- "Closed" means the city changed the status. It does not prove the problem was fixed. Any number on the site should say "closed," not "fixed."
- Under David's decision on #300: only a few big-picture totals, credited "Data from SeeClickFix, Morgantown 311."

**State roads (DOH).** We found no public count or timing of SWAT requests. The form promises no response time. The District 4 page lists work zones but not how long requests take. So we cannot say how fast state roads get fixed, and the site does not try.

**Other towns.** We found no public request tracker for Westover, Star City or Granville.

## What this means for the site

- The guide on `/make-it-better/report/` already covers "who" and "where": check the state map, then 311 or SWAT.
- "How fast" can only be shown for Morgantown city streets, from the 311 totals, once Duet checks them on #1078.
- Gap: no public timing for state road repairs. Logged in `docs/discoveries/2026-11-01-state-road-repair-timing.md`.
