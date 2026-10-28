# 2026-10-28: First weekly visibility audit

- **Considered:** fixing everything the audit found in one PR (titles, menu overflow, structured data) versus small safe fixes plus issues. The menu and recycling page are being changed in PR #128, so editing them here would cause conflicts.
- **Chose:** fix only what is safe and in the visibility lane: the home page canonical link (it pointed to a redirect), the two guides missing from `llms.txt`, and a page check that fails the build if either happens again. Filed #143 for place names in titles. Everything else already has an issue (#37, #47, #48, #89, PR #128).
- **Shipped:** `docs/visibility/2026-10-28.md` (audit results), changes to `site/src/layouts/Base.astro`, `site/src/pages/llms.txt.js`, `site/scripts/check-pages.mjs`.
- **Scoreboard:** no number moves yet. Hub pages showing up for findability searches is 0 of 10. Check again on the next visibility run, 2026-11-04.
