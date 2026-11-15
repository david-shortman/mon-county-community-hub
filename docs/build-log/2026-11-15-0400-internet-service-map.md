# Which places in Mon County have internet service (#1935)

**What.** A new page, `/internet-service-map/`, with Mon County's numbers from the West Virginia Office of Broadband's county summary: 38,428 places, 36,005 served by cable or fiber, 461 by wireless, 1,819 funded but not served yet, 143 unserved or underserved (FCC data as of December 31, 2025). It gives the state's own meaning of served, underserved, unserved and funded as fact records (`content/facts/internet/`), the state's note that its map uses newer data than BEAD did, and next steps that point to the state map and the existing sections of `/internet/`.

**How it was read.** Both county PDFs are images, so page 31 of each was rendered and read on 2026-11-14 (Morgantown date). The five rows add up to the printed total. The definitions come from the text of the state's Broadband Availability and Funding Dashboard. The PDFs list internet companies; the page names none.

**Why its own page.** #1867 (open for David) changes `internet.astro`, so this page sits alongside it. Once #1867 merges, `/internet/` ("Where the state is building") can link here.

**Also.** A discovery: no hotspot or laptop lending found in the county (the library's Library of Things lists none). Free Wi-Fi and computers at every library location are already on `/internet/`.
