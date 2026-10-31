# 2026-10-31: Every source says how it was read

- **Considered:** #70 and ADR 0002 (proposed): one provenance shape for hand, feed and watched-page records, with `method`, `fetched` and `feed` on each source. The public API v1 already publishes the separate `feed` object on calendar entries, so it must stay.
- **Chose:** add, don't move. Feed records now carry `method: feed`, `fetched` and the feed id on `sources[0]`, next to the `feed` object they always had. Meeting records carry `method: watched-page`. YAML files are unchanged; the API fills `method: hand` for them. The site's cards read only `url`, `checked` and `name`, so what residents see does not change.
- **Shipped:** the fields in `site/src/lib/feeds/index.mjs` and `site/src/lib/meetings/index.mjs`, and `sources[].method`, `sources[].fetched` and `sources[].feed` in the API's v1 shape and contract (additive). On this build: 146 org sources and 314 resource sources `hand`, 131 calendar sources `feed` and 93 `hand`, 142 meeting sources `watched-page`.
- **Left for later:** cards reading `sources[0].method` instead of `feed` to choose "Pulled from" or "Checked against". It works as is; switching is a presentation change.
- **Cost:** $0.
