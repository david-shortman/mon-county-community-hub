# 2026-10-30: Watch plan for community centers and halls (#458)

- **Considered:** a new watcher for the centers' pages, versus what already runs.
- **Chose:** no new code. The daily Source check already reads every YAML file in `content/`, so all place and center event sources are checked for broken links, changed text and phone mismatches. The stale rule is in `site/src/lib/places.mjs` (#693). What it cannot follow are sources with a new address each week (Dominion Post columns) and embedded calendars, so those became a weekly read for Duet (#752).
- **Shipped:** `docs/plans/2026-10-30-centers-watch.md`, the first weekly read logged (8 events in #699), and the recurring issue.
- **Cost:** $0.
