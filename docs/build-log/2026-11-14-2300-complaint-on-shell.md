# 2026-11-14: Complaint explainer moves onto the shared step shell (part of #1440)

- **Why:** the review of #1933 suggested it. The records request explainer (#1931) brought in `site/src/components/StepJourney.astro`, a shell made from the complaint explainer. Two copies of the same layout and script would drift apart.
- **Changed:** `site/src/components/ComplaintJourney.astro` now passes its steps, its drawing and its intro, key and summary text to `StepJourney`. It keeps only the CSS for its drawing and what each step shows. The words, facts and drawing on `/noise/` are the same. The skip link now points at `#cc-explainer-summary`; nothing else linked to the old ids.
- **Checks:** `site/test/complaint-journey.test.mjs` passes unchanged. Checked at 320px and 390px with 200% text, light and dark, still and live. Cost: $0.
