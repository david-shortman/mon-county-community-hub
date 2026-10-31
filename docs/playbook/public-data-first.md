# Public government data first, records requests only as a rare backup

Some lists the hub needs are held by government: licensed child care, county meetings and contracts, health department programs, shelter plans. Before anyone thinks about a West Virginia Freedom of Information Act (FOIA) request, we use what is already public. This page says where to look, and when a request might be worth asking David about. From #170.

## The rule

1. **Look for a public page or dataset first.** Most of what we need is already posted. Link to it, or read it on a schedule if it has a feed.
2. **Check what others have already asked.** The Secretary of State's FOIA database shows completed requests to every public body.
3. **A records request is a last resort, and always David's call.** Filing one is contacting a public body, so agents never file. A candidate request becomes a `for:david` issue that describes the exact records. Only consider records that exist nowhere online and change slowly, so one request a year or less would do.

## Why a request is a poor fit for most of our needs

- **It gets documents, not answers.** A request covers existing records, so it cannot tell us current hours or whether a program still runs. The law says "All requests for information must state with reasonable specificity the information sought" (W. Va. Code 29B-1-3(d), https://code.wvlegislature.gov/29B-1-3).
- **It can be slow.** The law gives the public body "a maximum of five days not including Saturdays, Sundays or legal holidays" to furnish the records, say when they can be inspected, or deny the request in writing (29B-1-3(d)). The real wait can be much longer. MuckRock, a site people use to file requests, shows long average waits for West Virginia, but its page blocked our reader and its numbers only count requests filed through MuckRock, so we do not quote them.
- **The requester's name goes public.** Every public body must report each completed request to the Secretary of State's database by the 10th of the next month, and entries stay up for five years (SOS FOIA FAQ, https://sos.wv.gov/foia-frequently-asked-questions-faq). The public entry pages show the requester's first and last name, the subject, the fee and the outcome (https://erls.wvsos.gov/FOIA_Database/Search, checked October 31, 2026). A request in the project's name would put whoever files it on that public list.
- **Costs are limited, but not zero.** A public body may charge "its actual cost in making reproductions of records" but "may not charge a search or retrieval fee" (29B-1-3(e)). Any fee is spending money, which is David's call.
- **There is a presumption that records are public,** with listed exemptions such as personal and medical files (W. Va. Code 29B-1-4, https://code.wvlegislature.gov/29B-1-4).

## Where to look first

All checked October 31, 2026. "Already read" means the hub reads it today; see the file named.

| Need | Public source | Format | Status |
|---|---|---|---|
| County meetings, agendas, minutes | Monongalia County Commission meeting schedule, https://www.monongaliacounty.gov/commission/meeting_schedule/index.php | HTML, PDFs | Already read (`site/src/lib/meetings/`) |
| City council and board agendas | Morgantown Agenda Center, https://www.morgantownwv.gov/AgendaCenter | HTML, PDFs, RSS | Already read (`site/src/lib/meetings/`) |
| City and county events | City iCalendar, county calendar | iCal, HTML | Already read (`site/src/lib/feeds/adapters/`) |
| Problems residents report to the city | Morgantown 311 (SeeClickFix) | JSON API | Already read (`site/scripts/check-311.mjs`) |
| County health measures | County Health Rankings, CDC PLACES | CSV, JSON API | Already read (`content/indicators/`, `site/src/lib/live-indicators/`) |
| County unemployment | BLS local area unemployment | JSON API | Already read (`site/src/lib/live-indicators/`) |
| Licensed child care | DoHS Bureau for Family Assistance, Find a Childcare Provider, https://bfa.wv.gov/find-childcare-provider | HTML search, county filter, no download | Not linked yet. Link it; do not copy the list |
| County DoHS office | DoHS field offices, https://dohs.wv.gov/field-offices | HTML | Source for `content/resources/monongalia-county-dohs-office.yaml` |
| What others asked for | SOS FOIA database, https://erls.wvsos.gov/FOIA_Database/Search | HTML search | Use before suggesting any request |
| A local list of hardship help | City of Morgantown PATHWAYS to Help, https://morgantownwv.gov/708/PATHWAYS-to-Help | HTML, no updated date | A partner list to compare against, not to copy |
| Business and nonprofit registrations | SOS business search, https://apps.sos.wv.gov/business/corporations/ | HTML search | Free to look up |
| State meeting notices | SOS meeting notices, https://apps.sos.wv.gov/adlaw/meetingnotices/ | HTML search | Free to look up |
| Contracts local governments can use | WV Purchasing Division, https://www.state.wv.us/admin/purchase/LocalGovt/LocalGovtSWC.html | HTML, PDFs | County contracts with local groups are more likely to show up in Commission agendas and minutes |
| Emergency sheltering | Mon County Emergency Operations Plan (2026 update), from https://www.mecca911.org/emergency_management/index.php | PDF | Describes sheltering in general; no warming shelter plan found. Its cover says "For Official Use Only," so describe it, do not quote it at length |
| Population, income, housing | Census ACS | JSON API (free key) or data.census.gov | Linked in [open data](open-data.md) |
| Internet service | WV Office of Broadband maps, https://broadband.wv.gov/ | ArcGIS | Linked on `/internet/` |

**Could not confirm:** a working state open data portal (data.wv.gov did not load), WV Checkbook, and the city bids page (both reset the connection). ZoomWV (school data) and the FBI Crime Data Explorer load but need JavaScript, so we could not check what they hold. Try these again before relying on them.

## How to look

1. Search the group's own site, then the county and city sites, then the state agency.
2. Check the meeting minutes. Contracts, plans and grants often appear in a Commission or Council agenda packet.
3. Search the SOS FOIA database by agency and subject to see whether someone already got the records, and from whom.
4. If it is still nowhere: is it worth a request? It should be a record that exists, changes slowly, and would help many residents. If yes, open a `for:david` issue that names the public body, the exact records, why the public sources are not enough, and that the requester's name will be posted. Do not draft the request letter in the repo.

## Candidate requests

At most a few, each a `for:david` issue:

- **The county and city warming shelter plan for winter 2026 to 2027.** We found no official page for it, and the newest coverage we found was a MetroNews story from September 2025 headlined that plans were unclear (https://wvmetronews.com/2025/09/03/plans-unclear-for-the-morgantown-monongalia-county-warming-shelter-as-fall-closes-in/). First step: read this fall's Council and Commission agendas and minutes. A request only if they say nothing. Shelter is high stakes, so anything that reaches the site waits for David anyway.

Licensed child care is **not** a candidate: the DoHS locator is public and searchable by county.

## Sources checked

All pages above were opened October 31, 2026, except MuckRock, which blocked our reader. Re-check by April 30, 2027.
