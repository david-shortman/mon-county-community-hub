# 2026-11-03: Needs list shows the coverage rating before and after (#1534)

- **Considered:** the wave 11 needs coverage lane will re-rate needs after filling gaps. A new rating alone hides what changed, and the reader cannot tell a need that was always rated good from one that just became good.
- **Shipped:** an optional `site_coverage.before` field (`level`, `checked`, `why`) in `content/schemas/need.schema.json`. `/needs/` shows it under the current rating as "Before: Partly, checked November 1, 2026", and a line near the top lists each need whose rating changed. `scripts/check-needs.mjs` checks the level, the date, and that the earlier date is not after the current one; the fixtures test both.
- **Left:** no need file uses it yet. The content PRs for #1534 set it as each need is re-rated.
