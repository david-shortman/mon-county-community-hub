# 2026-11-01: Recycling page: the last typed source lists move into records (#122)

- **Considered:** `/recycling/` was the first page built from fact records (#814), but it still kept a list of sources with a checked date typed into the page (October 30, 2026), for the pickup-day note, the drop-off center's rules and the Solid Waste Authority's contact line, and it typed the authority's street address. Nothing re-checks a date typed into a page.
- **Chose:** re-read the two source pages (both allow automated reads in their robots.txt) and store what they say as records. Cost: $0.
- **Shipped:**
  - `content/facts/recycling/pickup-days.yaml` (the county recycling page, re-check every 180 days) and `center-rules.yaml` (the drop-off center's home page: no plastic bags, flatten cardboard at the seams, no soiled pizza boxes; every 90 days), each with the source's own words.
  - `contact.place` on `content/resources/mon-swa-ask-about-trash.yaml`: 113 Mathieson Street, Suite 100, Morgantown, WV 26501, from the footer of monongaliacountyswa.com, read November 1, 2026. The page's Directions button now reads it from the record.
  - `site/src/pages/recycling.astro` no longer types any source or checked date. The contact line cites the authority's home page, which shows the phone, email and address.
- **Visible change:** three source lines now say "Checked November 1, 2026" instead of October 30, the contact line has one source instead of two, and the map link adds the ZIP code. The words of the page are the same.
- **Not changed:** the drop-off center's home page also says it is closed Tuesday, November 3, 2026, for Election Day. That is a one-day closure for whoever keeps the center's listing to weigh; this PR only moves facts that were already on the page.
