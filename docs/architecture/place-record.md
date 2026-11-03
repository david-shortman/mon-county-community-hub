# One record per place, many outputs (#399)

Each gathering place (community centers, senior centers, neighborhood houses, rec buildings, halls, library branches and groups) is stored once, in `content/places/<slug>.yaml`, shaped by `content/schemas/place.schema.json`. Everything the site says about a place is built from that one record, so a change is made in one place and every output follows on the next build. Checked against the code on November 3, 2026.

## What reads the record

| Output | Where | Fields it uses |
|---|---|---|
| The place page | `site/src/pages/community-centers/[slug].astro` | all: story, facilities, regular, rentals, membership, contact, status, sources |
| Text, print or share it ("Pass it on") | same page, `PassItOn` component (added for #399) | name, `contact.phone`, `contact.place`, oldest checked date |
| Printable flyer with a QR code | `community-centers/[slug]/flyer.astro` | name, story, what is there, contact, checked date |
| Status line ("No recent activity seen, call first") | `site/src/lib/places.mjs` (`placeStatus`) | `status`, `last_activity_seen` |
| Hall finder and the centers list | `community-centers/halls.astro`, `community-centers/index.astro` | rentals, facilities, area |
| Town and area pages | `site/src/lib/town-hubs.mjs` | `community`, kind |
| Find your people | `site/src/pages/find-your-people.astro` | groups and library branches (`kind: group` or `library`) |
| Upcoming events at a place | calendar entries with `venue: <slug>` | slug |
| Open data API | `/api/v1/places.json` and one file per place (`site/src/lib/api.mjs`) | the whole record, with its own JSON Schema |
| MCP server and other apps | read the API above | the whole record |
| Reach count on the scoreboard | `content/findability/reach.py` | `contact.place`, `area`, `community` |
| "Did you know?" on All topics | `site/src/components/KeepExploring.astro` | `story`, sources, `area` |
| Phone re-check queue | `site/scripts/call-queue.mjs` | `status`, `last_activity_seen`, contact |

## Guarantees

- `npm run check-content` fails a place with no source or no checked date (`site/scripts/check-content.mjs`, `check-places.mjs`).
- A place is as fresh as its oldest source. The page, the flyer and the share text all show that date.
- A place not seen active for a while shows "No recent activity seen, call first" on every output that uses `placeStatus`.

## Not built yet

- **HSDS `location` export.** HSDS wants a split address (street, city, state, postal code); places hold one line. Worth doing when a partner asks (see `hsds-mapping.md`).
- **A voice line script.** #398 suggested one; there is no phone line to read it, so nothing is built.
- **Structured hours.** Places write their regular happenings in words and have no hours fields, so there is no open now badge for places. Services (`content/resources/`) have one.

## Adding a new output

Read the record with `loadPlaces()` (centers and halls) or `loadAllPlaces()` (also libraries and groups) from `site/src/lib/places.mjs`. Never copy a place's facts into a page. Show the record's oldest checked date wherever its facts appear.
