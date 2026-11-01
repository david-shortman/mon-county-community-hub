# 2026-11-01: Calendar cards read provenance from the source (#70)

- **Considered:** #70 asked for one provenance shape. Most of it landed in #925: feed sources carry `method: feed`, `fetched` and the feed id, and the API publishes them. The last step was the card itself, which still chose "Pulled from" or "Checked against" from the separate `feed` object.
- **Chose:** have `EventCard.astro` read `sources[0].method` and `fetched`, and keep the `feed` object only for the feed's display name, since API v1 publishes it. Cost: $0.
- **Shipped:** the card change; `site/test/feed-provenance.test.mjs`, which fails if any feed record (134 today) lacks `method`, `fetched` or the feed id on `sources[0]`; a short note on `method` in `content/README.md`.
- **Checked:** all 106 "Pulled from ... on ..." lines on the built site are the same before and after.
