# Social Security and WorkForce WV pages refuse automated reads

- **Found:** 2026-11-01, writing the "after you apply" pages for disability and unemployment (#1161, #1166, part of #1148)
- **What we found:** ssa.gov and workforcewv.org returned HTTP 403 to automated reads, so the steps they post (SSA processing times and online status, where to file an unemployment appeal) could not be checked. The federal rules (ecfr.gov) and the state code (code.wvlegislature.gov) did load, so the pages use those for deadlines.
- **Evidence:** see #1165.
- **Why it matters:** Tools that help people find benefit steps, including ours, can't confirm the agencies' own instructions.
- **Who keeps it:** U.S. Social Security Administration; WorkForce West Virginia
- **Status:** open (#1165)
