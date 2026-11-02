# PSTEPS, the Pre-K and Head Start application site, now blocks all robots

- **Found:** 2026-11-01, rechecking whether 2027-28 Pre-K and Head Start application dates are posted (#418, sprint wave 9, #529)
- **What we found:** www.preschoolsteps.org/robots.txt says `User-agent: *` and `Disallow: /`, so our sessions and scheduled checks may not read any page there. On 2026-10-30 a session read its 2026-27 window ("Completed applications received between 2/4/2026 and 4/16/2026 will have equal enrollment opportunities"). The county's MCS Early Childhood pages (littles.mono.k12.wv.us) are readable but show no 2027-28 dates.
- **Why it matters:** PSTEPS is where the county's application window is posted, and #418 plans a recheck there in January 2027. That recheck now needs a person. The daily source check will skip the PSTEPS source on `mcs-prek-and-head-start`.
- **Who keeps it:** Monongalia County Schools (MCS Early Childhood)
- **Status:** open
