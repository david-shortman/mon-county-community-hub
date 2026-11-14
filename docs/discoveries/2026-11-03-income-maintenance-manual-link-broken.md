# The state's benefits manual cannot be downloaded from its official page

- **Found:** 2026-11-03, while working through the daily Source check list (#506, sprint wave 14, #529)
- **What we found:** The West Virginia Department of Human Services Income Maintenance Manual, the rule book for SNAP, Medicaid, WV WORKS and other benefits, returns "page not found" at both its old address and the new address its official page links. Other files on the same site load normally.
- **Evidence:** all read on 2026-11-03.
  - The manual page, https://bfa.wv.gov/income-maintenance-manual, links "the current Income Maintenance Manual" at https://bfa.wv.gov/media/40019. That address returns 404.
  - The address the manual had on 2026-10-31, https://bfa.wv.gov/media/40005/download?inline, returns 404.
  - Other files on bfa.wv.gov load, for example https://bfa.wv.gov/media/40007/download?inline (the SNAP application).
- **Why it matters:** The manual is the public source for benefit time limits, such as how long someone has to ask for a fair hearing. While it is missing, residents and helpers cannot read the rules for themselves, and pages like ours cannot re-check them. Our pages that quote it are tracked in #1677.
- **Who keeps it:** WV Department of Human Services, Bureau for Family Assistance (its website).
- **Status:** fixed on 2026-11-14 for our pages (#1677). The [manual page](https://bfa.wv.gov/income-maintenance-manual) now links the current manual at https://bfa.wv.gov/media/40020/download?inline (file dated November 4, 2026; Duet saw it load on 2026-11-10). Every quote our 8 pages take from the manual was found in that file on 2026-11-14, and every section they cite is still there. The old `media/40005` address still does not load, so anyone else linking it is still broken.
