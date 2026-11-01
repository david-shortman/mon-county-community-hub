# Three sources our pages cite now ask robots not to read them

- **Found:** 2026-11-01, during verification sweep 4 (#529)
- **What we found:** Three hosts our content cites have robots.txt rules that tell automated readers to stay out, so our sessions may not re-read them on their own (see [automated reads](../operations/automated-reads.md)):
  - `www.preschoolsteps.org` (Pre-K sign-up, cited in `content/resources/mcs-prek-and-head-start.yaml`): `User-agent: *` / `Disallow: /`.
  - `wvclboard.wv.gov` (WV Contractor Licensing Board, cited on `/contractor-license/`): `User-agent: *` / `Disallow: /`.
  - `cdn.sanity.io`, where the Monongalia County Health Department's PDFs are stored (fee schedules, permit packets, loan guidelines, cited in about 12 files under `content/` and on `/selling-food/`): `Disallow: /*.pdf`, with only one other site's folder allowed.
- **Evidence:** each host's /robots.txt, read 2026-11-01.
- **Why it matters:** These facts can only be re-checked by a person in a browser, so they need a place on the weekly person checklists, or another official page that states the same facts.
- **Who keeps it:** Monongalia County Schools (Pre-K site), the WV Contractor Licensing Board, and the Monongalia County Health Department (whose files are hosted on Sanity).
- **Status:** open
