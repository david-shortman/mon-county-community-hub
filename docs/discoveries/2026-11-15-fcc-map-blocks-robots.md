# The FCC's broadband map and main site refuse automated reads

- **Found:** 2026-11-15, while working on #2010 (sprint wave 21, #529).
- **What we found:** `broadbandmap.fcc.gov/robots.txt` and `www.fcc.gov/robots.txt` both answer with a 403 "Access Denied" page, and `docs.fcc.gov/robots.txt` answers 403 Forbidden. Under our rule (`docs/operations/automated-reads.md`), a 403 on robots.txt means no robot reads anything on that site. So we cannot read, by script, which companies the map lists at an address, or the map's current data as-of date. The FCC's Broadband Data Collection help center, `help.bdc.fcc.gov`, has a robots.txt that allows its help articles, and it explains how to use the map and how to challenge it.
- **Evidence:** robots.txt reads of the three FCC hosts on 2026-11-15 (403 each, sent as MonCountyCommunityHub); `https://help.bdc.fcc.gov/robots.txt`, read 2026-11-15 (allows `/hc/en-us/articles/`); the four help articles cited in `content/facts/internet/fcc-*.yaml`.
- **Why it matters:** residents asking "can I get fast internet at this address?" need the FCC map, but the site can only explain how to use it, not show the answer for an address or say how current its data is.
- **Who keeps it:** the Federal Communications Commission.
- **Status:** open. `/internet-service-map/#fcc-map` links to the map and gives the FCC's own steps. A person checks the map each quarter (person sources checklist). The data as-of date waits on a `needs-verification` issue.
