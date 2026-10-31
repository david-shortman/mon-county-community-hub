# 2026-10-30: Listing fields for a place to go

- **Considered:** the presentation guide lists ten facts every listing needs. Resources had hours in words and an address, but no hours a page could read, and nothing for how to get in, languages or access (#177).
- **Chose:** four optional resource fields: `opening_hours` (days with quoted 24-hour times, or `always`), `get_in` (`walk-in`, `appointment`, `call-first`), `languages` and `access`. They live in `site/src/lib/listing.mjs`, which the content check and the place card (#176) share. `opening_hours` needs `hours` in words too, so the words always show.
- **Check:** `npm run check-content` fails on bad values and warns when a place to go (a record with `contact.place`) has no `hours`, `cost` or `get_in`. Four records warn today. They get filled only from their sources, in later PRs.
- **No data changed here.** The first fill for a shelter would wait for David, so it goes in its own PR.
- **Cost:** $0.
