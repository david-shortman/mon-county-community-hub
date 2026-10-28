# Open data standards we should adopt

Our data lives in plain YAML files in `content/`. That is easy for people and agents to edit, but other tools cannot use it unless we also publish it in shapes they already understand. This page lists the open standards that fit our work, what each one is, and what we will and will not do with it.

## Publish service listings in HSDS

**What it is.** The Human Services Data Specification (HSDS) from Open Referral is a shared format for "who offers what help, where, and when." Its core objects are `organization`, `service`, `location`, and `service_at_location` (a service offered at one place). Supporting objects include `contact`, `phone`, and `schedule`. The newest version in the changelog is 3.2.3. Since 3.0, JSON is the main format. A Tabular Data Package (one CSV per object plus a `datapackage.json` file) is also allowed. The spec itself is licensed CC BY-SA 4.0.

**Why it matters here.** Referral tools, 211 systems, and civic apps can read HSDS. Publishing it lets them reuse our listings without asking us to change anything.

**How we apply it.** Keep YAML as the source of truth and add a build step that exports HSDS JSON and CSV. A first mapping:
- `orgs/*.yaml`: `name` to `organization.name`, `summary` to `organization.description` (required), `website` to `organization.website`, `slug` to a stable `id`.
- `resources/*.yaml`: `title` to `service.name`, `org` to `service.organization_id`, `who_it_is_for` to `eligibility_description`, `what_to_do` to `application_process`, `cost` to `fees_description`, `contact.url` to `service.url`, `contact.phone` to a `phone` object, newest `sources[].checked` to `last_modified`. Set `status: active` (required).
- We have no addresses or hours yet, so `location` and `schedule` stay empty for now. `orgs/` and `resources/` are still empty, so build the exporter alongside the first entries.

**Sources:**
- [HSDS overview, core objects](https://docs.openreferral.org/en/latest/hsds/overview.html)
- [HSDS schema reference, fields and required fields](https://docs.openreferral.org/en/latest/hsds/schema_reference.html)
- [Serialization formats, JSON and CSV](https://docs.openreferral.org/en/latest/hsds/serialization.html)
- [HSDS changelog, versions](https://docs.openreferral.org/en/latest/hsds/changelog.html)
- [Open Referral license, CC BY-SA 4.0](https://docs.openreferral.org/en/latest/about/license.html)

## Use open topic labels, not the 211 taxonomy

**What it is.** The 211 HSIS Taxonomy (from 211 LA County) is the most common way to classify human services. It is copyrighted. Its notice says no part may be reproduced or transmitted in any form without prior written permission from 211 LA. Use is governed by a paid subscription agreement. Open Eligibility is an open alternative with two parts, "human services" and "human situations." Its repository is still public and licensed CC BY-SA 3.0.

**Why it matters here.** Our content is public and CC BY 4.0. We cannot mix in licensed taxonomy codes or definitions without permission. Doing so could also break the license we give others.

**How we apply it.** Keep our own short `topics` list (money, food, housing, health, and so on), as in `content/README.md`. Do NOT copy 211 taxonomy codes, terms, or definitions into the repo or site. Linking to a 211 service or naming the 211 phone line is fine. If we want a richer open list, consider mapping our `topics` to Open Eligibility in a separate file. Its ShareAlike terms mean any adapted copy must keep CC BY-SA, so keep it apart from CC BY content. HSDS has an `attribute` object for links to a taxonomy if we ever do this.

**Sources:**
- [211 LA taxonomy copyright statement](https://211la.org/211-la-taxonomy-copyright-acknowledgement-statement)
- [211 LA taxonomy subscription agreement (sandbox copy)](https://taxonomy-sandbox.211la.org/library/Subscription_Agreement.pdf)
- [Open Eligibility repository, CC BY-SA 3.0](https://github.com/auntbertha/openeligibility)

## Read city requests through Open311 GeoReport v2

**What it is.** Open311 GeoReport v2 is a finished standard API for non-emergency city service requests like potholes. `GET services` lists request types. `GET requests` lists requests for up to 90 days at a time. Neither needs an API key. Creating a request (`POST`) does need a key.

**Why it matters here.** Morgantown runs "Morgantown 311" on SeeClickFix. On 2026-10-28 SeeClickFix's GeoReport v2 endpoint returned 40 Morgantown request types, such as "Street Maintenance Needed/Pothole," "Street Light Request," and "Garbage Service Issues." Recent requests also came back. That could power a plain guide on how to report a problem, and show which kinds of reports are most common.

**How we apply it.** Issue #26 already asks David whether the city's 311 data can be used. Until that is decided, we may link to the city's Service Request page, but we will NOT ingest, store, or republish request records. Records include street addresses and free text written by residents. If David gets a yes, use only aggregate counts by type and month, never single requests or text. We will never submit requests, since that needs a key and an account.

**Sources:**
- [GeoReport v2 specification](https://wiki.open311.org/GeoReport_v2/)
- [City of Morgantown Service Request page](https://www.morgantownwv.gov/428/Service-Request)
- [Morgantown on SeeClickFix](https://seeclickfix.com/morgantown)
- [SeeClickFix GeoReport v2 services list for Morgantown](https://seeclickfix.com/open311/v2/services.json?lat=39.6295&long=-79.9559)

## Keep the calendar feed strict to RFC 5545

**What it is.** RFC 5545 defines iCalendar, the `.ics` format phone and desktop calendars read. Every event needs a `UID` that is persistent and globally unique. The RFC suggests a domain name to the right of an "@". Lines should be folded at 75 octets. RFC 7986 adds properties like `NAME`, `REFRESH-INTERVAL`, and `COLOR`.

**Why it matters here.** People who subscribe to `calendar.ics` get updates in place only if each event keeps the same UID. A changed UID shows up as a duplicate.

**How we apply it.** `site/src/pages/calendar.ics.js` already does the key things: UID from the entry `slug`, folded lines, all-day `DATE` values, and an exclusive `DTEND`. Small fixes to consider:
- Put our real host on the right side of the UID (for example `<slug>@david-shortman.github.io`). Do this once, since changing UIDs creates duplicates for current subscribers.
- Add RFC 7986 `NAME` and `REFRESH-INTERVAL;VALUE=DURATION:P1D` next to the `X-WR-` lines.
- Never reuse a slug for a different event. The README already says to change the slug each year.

**Sources:**
- [RFC 5545, iCalendar (UID in section 3.8.4.7, folding in 3.1)](https://www.rfc-editor.org/rfc/rfc5545)
- [RFC 7986, new iCalendar properties](https://www.rfc-editor.org/rfc/rfc7986)

## Add schema.org JSON-LD to pages

**What it is.** Schema.org is a shared vocabulary that search engines and other tools read from pages, usually as a JSON-LD script tag. Useful types: `Organization`, `Service`, `GovernmentService` (a service run by a government, with `jurisdiction`, `provider`, `areaServed`, `audience`), `Event`, and `SpecialAnnouncement` (short dated local updates). Google's Event guidelines require `name`, `startDate`, and a `location` with an address. They exclude business hours, promotions, virtual-only events, and pages not about a single event. Google stopped showing SpecialAnnouncement rich results in 2025, though the type remains in schema.org.

**Why it matters here.** Clear markup helps search engines and AI tools show the right org, date, and link.

**How we apply it.** Add JSON-LD in `site/src/layouts/Base.astro` slots, built from YAML. Use `Organization` for `orgs/`, `Service` or `GovernmentService` for `resources/` (government `kind`), and `Event` only for real in-person events with an address, like a mobile pantry or tire collection. Do NOT mark up deadlines (a tax due date is not an event) or anything without a physical location. Skip `SpecialAnnouncement` for now.

**Sources:**
- [schema.org Event](https://schema.org/Event)
- [schema.org Organization](https://schema.org/Organization)
- [schema.org Service](https://schema.org/Service)
- [schema.org GovernmentService](https://schema.org/GovernmentService)
- [schema.org SpecialAnnouncement](https://schema.org/SpecialAnnouncement)
- [Google Event structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Google blog, June 2025 retired rich result types](https://developers.google.com/search/blog/2025/06/simplifying-search-results)

## Draw on public data portals, and check their terms

**What it is.** These portals were reachable on 2026-10-28:
- WV GIS Technical Center's State GIS Data Clearinghouse, with statewide layers by county.
- MapWV, the state mapping gateway, including a property assessment viewer.
- WV View, a remote sensing group that shares data links and tools.
- Monongalia County GIS and Mapping, which links an assessor parcel viewer and the MMAGIC hub (a county and city geospatial group). The county says MMAGIC data is sold for personal use and is not to be resold.
- data.census.gov, County Health Rankings (Monongalia page), and CDC PLACES (local health estimates by county, place, census tract, and ZIP area).

We did not find a statewide open data catalog or a City of Morgantown open data portal. `data.wv.gov` could not be reached from our environment.

**Why it matters here.** The community health metrics topic needs trusted numbers, and maps help people find services.

**How we apply it.** Link to these sources and cite them in `sources`. Republish only data whose terms allow it. The WVGISTC site says "all rights reserved" and the county sells its GIS data, so link to them, do not copy. Census, CDC PLACES, and County Health Rankings are better first sources for health metrics. A `for:david` issue can ask whether MMAGIC layers may be shown.

**Sources:**
- [WV State GIS Data Clearinghouse](https://www.wvgis.wvu.edu/data/data.php)
- [MapWV](https://www.mapwv.gov/)
- [WV View](https://wvview.org/)
- [Monongalia County GIS and Mapping](https://www.monongaliacounty.gov/departments/gis_mapping/index.php)
- [MMAGIC hub](https://mmagic-monco.hub.arcgis.com/)
- [data.census.gov](https://data.census.gov/)
- [County Health Rankings, Monongalia](https://www.countyhealthrankings.org/health-data/west-virginia/monongalia)
- [CDC PLACES](https://www.cdc.gov/places/)

## License what we publish, every time

**What it is.** Our `content/` folder is CC BY 4.0: anyone may reuse it, even commercially, with credit. Code is MIT. CC BY 4.0 lets others share and adapt with attribution.

**Why it matters here.** Clear terms are what make our data reusable by city offices, nonprofits, and other tools.

**How we apply it.** Every export (HSDS JSON, CSV, `calendar.ics`) should state the license and credit line from `content/LICENSE.md`. In `datapackage.json`, fill the `licenses` field. Never add third-party data whose terms are stricter than CC BY (211 taxonomy, county GIS, ShareAlike lists) into `content/`. Keep it in a separate, labeled place, or link instead.

**Sources:**
- [CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/)
- [Our content license](../../content/LICENSE.md)

## Checked

Sources checked 2026-10-28.
