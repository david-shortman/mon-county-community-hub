# Your state lawmakers: find your districts, then each lawmaker's official page (#1766)

`/state-lawmakers/` shows how to find your West Virginia House and Senate districts by address, and lists the lawmakers whose districts cover part of Mon County, each linked to their official page on wvlegislature.gov.

**Why:** a resident who wants to contact a delegate or senator has to know their district first. The Legislature's Lawmaker Search is still down for maintenance (read 2026-11-14), but the Legislature's own ArcGIS site has a working District Search map. A test with the County Courthouse address returned House 79, Senate 13 and Congress 2. Its result cards use file names ("HODfinal shp" for the House), so the page says which card is which.

**Data:** `site/src/lib/state-lawmakers.mjs`. Districts and names come from the House and Senate rosters and each member's page, whose "District Counties" line is copied word for word: House 77 to 82, Senate 2 and 13. Names and districts only, no party, nothing about votes. Members change after elections, appointments and resignations, so re-check every 90 days and after any change.

**Not done:** an address box on our own site. That would send a resident's address to a geocoding service; the official map already does the lookup, so we link to it instead.

Linked from `/who-decides/` under More. The discovery `docs/discoveries/2026-11-03-no-working-legislator-lookup.md` is updated.
