# No official Spanish SNAP or WIC page at the USDA's Spanish addresses

- **Found:** 2026-11-01, looking for official Spanish pages to link from the Spanish pilot (#1101, plan `docs/plans/2026-10-31-languages.md`, "Link before we translate")
- **What we found:** `https://www.fns.usda.gov/es/snap` and `https://www.fns.usda.gov/es/wic` now redirect to `www.fna.usda.gov`, and from there to the English SNAP and WIC pages. The English SNAP page lists no Spanish version (its only `hreflang` link is `en`). 988lifeline.org (including `/es/`) and medicaid.gov returned HTTP 403 to a plain scripted read, so we did not read them; the site's rule is never to work around a block (`docs/operations/automated-reads.md`).
- **Why it matters:** The languages plan counts on linking official Spanish pages for benefits and crisis help instead of writing our own Spanish version of the rules. Until a person confirms where those pages are now, the Spanish pilot links none of them.
- **Who keeps it:** U.S. Department of Agriculture (SNAP, WIC); Centers for Medicare and Medicaid Services (Medicaid); Vibrant Emotional Health for SAMHSA (988)
- **Status:** open
