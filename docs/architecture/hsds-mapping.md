# How our content maps to Open Referral HSDS

For #36. The export built from this mapping is #73: `/api/v1/hsds/` on the site, made by `site/src/lib/hsds.mjs` and checked by `site/scripts/check-hsds.mjs`.

HSDS (the Human Services Data Specification) is the shared format that 211 systems, referral tools and civic apps read. We map to **HSDS 3.1.1**, checked against the schema files Open Referral publishes for that version on 2026-10-30:

- Docs: https://docs.openreferral.org/en/latest/hsds/overview.html and https://docs.openreferral.org/en/latest/hsds/serialization.html
- Schema: https://github.com/openreferral/specification/tree/3.1.1/schema

The HSDS schema files are under CC BY-SA 4.0, so we do not copy them into this repo. The export check fetches them from Open Referral at the pinned version. Our data stays CC BY 4.0.

## Ids

HSDS ids are UUIDs. Ours are UUID v5, made from the record's kind and slug (`organization:<slug>`, `service:<slug>`, `service-phone:<slug>` and so on) in a fixed namespace: UUID v5 of `https://everythingmorgantown.org/` in the standard URL namespace. The same slug always gives the same id, so two builds give identical ids. Renaming a slug changes the id, the same way it changes the record's web address.

## `orgs/` to HSDS `organization`

| Our field | HSDS field | Notes |
|---|---|---|
| `slug` | `id` | UUID v5, see above |
| `name` | `name` | |
| `summary` | `description` | HSDS requires a description |
| `website` | `website` | |
| `phone` | `phones[].number`, `type: voice` | |
| (record URL) | `uri` | Our API record, like `/api/v1/orgs/<slug>.json` |
| `kind` | no HSDS equivalent | `legal_status` and `tax_status` mean something narrower; we do not guess them |
| `area` | no HSDS equivalent on organization | `service_area` is per service; see gaps |
| `topics` | no HSDS equivalent | HSDS uses `attribute` plus a taxonomy; see gaps |
| `sources` | no HSDS equivalent | HSDS `metadata` records edit history, not sources. Sources stay in our own API |

## `resources/` to HSDS `service`

| Our field | HSDS field | Notes |
|---|---|---|
| `slug` | `id` | UUID v5 |
| `org` | `organization_id` | UUID v5 of the org slug. A service whose org is hidden is left out, since HSDS needs it |
| `title` | `name` | |
| `who_it_is_for` + `what_to_do` | `description` | Joined, for apps that show only a description |
| `who_it_is_for` | `eligibility_description` | Quoted from the source, never an eligibility decision |
| `what_to_do` | `application_process` | |
| `cost` | `fees_description` | Text as the source gives it. We do not fill HSDS `cost_option` amounts |
| `hours` | `schedules[].description` | Free text. We do not turn hours into RRULE fields, because a wrong rule is worse than plain words |
| `contact.url` | `url` | |
| `contact.email` | `email` | Public program addresses only |
| `contact.phone` | `phones[].number`, `type: voice` | |
| `contact.text` | `phones[].number`, `type: text` | |
| `contact.place` | not exported yet | HSDS `address` needs a postal code and split fields our records do not have; see gaps |
| `contact.url_label` | no HSDS equivalent | A button label for our site |
| (always) | `status: active` | Hidden records are not exported at all |
| newest `sources[].checked` | `last_modified` | As noon UTC on that date, which is the same day in Morgantown |
| `topics` | no HSDS equivalent | See gaps |
| `sources` | no HSDS equivalent | Kept in `/api/v1/resources.json` |

## `calendar/` and `corrections/`

No HSDS object fits dated events or our corrections log. They stay in our own API (`/api/v1/calendar.json`, `/api/v1/corrections.json`) and in `calendar.ics`.

## Gaps

- **Locations and addresses.** HSDS `location` and `address` need structured parts (street, city, state, postal code). Our `place` is one line. Adding `location` would mean splitting addresses and adding postal codes from the source page. Worth doing once a partner asks for it; until then the address is in our own API.
- **Service areas.** Our `area` is on the organization and means where it works, which is not always where a given service is offered. We leave `service_area` empty rather than guess.
- **Topics.** HSDS carries categories through `attribute` and a named taxonomy. We do not use the 211 (AIRS) taxonomy, which is copyrighted. If a richer topic list is wanted, Open Eligibility could be mapped in a separate file, kept apart from our CC BY content because of its ShareAlike terms (see `docs/playbook/open-data.md`).
- **Sources and checked dates.** HSDS has no field for them. Apps that need provenance should read our own API, which the HSDS datapackage description points to.
- **Schedules as rules.** HSDS supports iCal-style schedule rules. We publish hours as text only.

## Fields we leave out on purpose (privacy)

We never fill these, even if a source shows them:

- `contact` (named staff), `contact.email` and `contact.phone` for a person: we list only public organizational contacts.
- `assurer_email` and `assured_date`: they would name the person who checked a record.
- `tax_id`: not needed to find help.
- `metadata.updated_by`: it would name a person. Our public history is in the GitHub log instead.

## Recommendation

Done in #73: the build exports HSDS 3.1 JSON (organizations with their services, services with their organization, one file per record) and a Tabular Data Package (`organizations.csv`, `services.csv`, `phones.csv`, `schedules.csv` and `datapackage.json` naming CC BY 4.0). Every build checks the output against the published HSDS schema, checks that ids are stable, and checks that the tables match. Next steps, only when someone needs them: locations with structured addresses, and an open topic taxonomy in a separate file.
