# 2026-10-28: Architecture map, target, and decision records

- **Considered:** letting each new site, app, and feed grow its own data and code, versus one plan that every surface follows. With several sessions building at once and the charter calling for APIs and MCP servers, the plan had to come first.
- **Chose:** a static-first design: `content/` stays the one source of truth, checked by JSON Schemas; every record carries the same provenance fields; the build publishes a versioned JSON API on GitHub Pages (which already allows cross-site reads); a read-only MCP server reads that API; shared code goes in `packages/`, extra surfaces in `apps/`, and new tools start as pages in the main site.
- **Shipped:** [`docs/architecture/`](../architecture/README.md): a map of what exists today and its risks, the [target for the next 6 to 12 months](../architecture/target.md), and six proposed decision records (data model, provenance, API and MCP, repo layout, agent ownership, hosting and cost). Filed eight roadmap issues in order, #69 to #76.
- **Scoreboard:** no change. This is groundwork so later builds can be counted and reused.
