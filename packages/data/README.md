# @everything-morgantown/data

One loader and shared checks for the YAML records in [`content/`](../../content/README.md) (#69, [ADR 0004](../../docs/architecture/adr/0004-monorepo-layout.md)). Every surface (the site, the API, the MCP server, later apps) should read content through this package so all of them see the same records the same way.

## What is in it

- `index.mjs`: `CONTENT_DIR`, `loadDir`, `loadCalendar`, `ymd`, `todayYmd`, hidden records (`HIDDEN_REASONS`, `isHidden`, `isPast`), staleness (`STALE_DAYS`, `isStale`, `oldestChecked`) and the re-check cadence (`isTopTier`, `recheckDaysFor`, `recheckProblems`, `recheckDue` and their constants).
- `checks.mjs` (import `@everything-morgantown/data/checks`): `isDate`, `isUrl` and `hiddenProblems`, used by `site/scripts/check-content.mjs`.

Display helpers (pretty dates, source labels, phone links) stay in `site/src/lib/content.mjs`. That file re-exports everything here, so its importers did not change.

## Use it

```js
import { loadDir, isStale } from '@everything-morgantown/data';
```

Install once at the repo root with `npm ci`. Run the tests with `npm test -w packages/data` (or `npm test` at the root, which runs these and the site's).

## Next

- JSON Schemas for orgs, resources and calendar in `content/schemas/`, checked from here (step 4 of the plan on #69).
- Feed adapters as `packages/ingest` (#71), on the same workspace.
