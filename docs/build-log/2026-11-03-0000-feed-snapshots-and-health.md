# 2026-11-03: Feed saved copies say how they were made, and Health reads feed-health.json (#71)

- **Considered:** what is left on #71. The move to `packages/ingest` needs the npm workspace switch, which waits for David (#69), so it is not done here. Two smaller steps from the issue do not need it.
- **Shipped:** every saved feed copy in `site/src/lib/feeds/snapshots/` now starts with `generated_by`: made by a script, do not edit by hand, rebuild with `npm run update-feeds`. The 8 existing copies got the line too; their dates are unchanged. The Health check's feeds item now also reads `/api/v1/feed-health.json` from the live site and lists a feed the last build could not read at all (warning), one where the build fell back to its saved copy, and one read live with no upcoming dates. Feeds turned off or blocked by robots.txt are left to the existing lines.
- **Result today:** one note, Friends of Deckers Creek's feed was read live but had no upcoming dates.
- **Left on #71:** the move to `packages/ingest` (after #69), and alerts for a feed that fails three days running or drops by half, which need a history of feed-health files.
