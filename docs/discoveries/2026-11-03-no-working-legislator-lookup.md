# No working official way to look up your state legislators by address

- **Found:** 2026-11-03, while trying to add a "find your state legislators" link to the government pages (topic depth lane, #529)
- **What we found:** We could not find a working official page where a resident enters an address and sees their state House and Senate districts. The Legislature's Lawmaker Search says it is down for maintenance. Its District Maps page still describes the 2010 district plan and says the maps "show current district boundaries, not those enacted as part of the 2020 redistricting cycle." The 2020 redistricting pages show proposed maps from committee members, with a note that they are not official action.
- **Evidence:**
  - Lawmaker Search, read 2026-11-02 (Eastern): https://joint.wvlegislature.gov/lawmaker-search/ ("The Lawmaker's search is currently down for maintenance and will be reinstated soon.")
  - District Maps, read 2026-11-02: https://www.wvlegislature.gov/districts/maps.cfm ("Senate District Maps - 2010 Plan"; "The maps below show current district boundaries, not those enacted as part of the 2020 redistricting cycle")
  - Redistricting page, read 2026-11-02: https://www.wvlegislature.gov/redistricting.cfm (links "Official Interactive District Maps - hosted by ARCGIS"; the rest of the page is about 2021 hearings)
  - Senate 2020 maps page, read 2026-11-02: https://www.wvlegislature.gov/Districts/2020/senatemaps.cfm ("Publication of such maps does not reflect ... official action")
- **Why it matters:** A resident who wants to contact their delegate or senator has to know their district first. The pages most likely to come up describe an older plan, and the address search is offline.
- **Who keeps it:** The West Virginia Legislature (Joint Committee on Government and Finance runs the Lawmaker Search).
- **Status:** partly resolved, 2026-11-14 (#1766). The Lawmaker Search still says it is down for maintenance (read 2026-11-14). But the Legislature's own ArcGIS site, which its Redistricting page links as "Official Interactive District Maps", has a working address lookup:
  - District Search, tested 2026-11-14: https://wvlegislature.maps.arcgis.com/apps/instant/lookup/index.html?appid=7eebb7df971a4652a3d7375f3a3de9df. Typing the County Courthouse address (243 High Street) returned House district 79, Senate district 13 and Congressional district 2. Its web map is described as "for identifying the post-2021 delegate, senatorial, and congressional districts" (https://www.arcgis.com/home/item.html?id=57f9e9f83109403887e15da991ff9234).
  - Its result cards use file names, not plain titles: the House district shows under "HODfinal shp". The site's page explains which card is which.
  - Which districts cover Mon County comes from each member's official page ("District Counties"), read 2026-11-14: House 77 to 82 and Senate 2 and 13.
  - The site now links the District Search and lists Mon County's lawmakers on `/state-lawmakers/`. The address search on the Lawmaker Search is still a gap; keep re-checking it.
