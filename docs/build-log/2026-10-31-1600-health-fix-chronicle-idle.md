# 2026-10-31: Chronicle no longer waits for a quiet network

- **Considered:** raising the 30 second timeout, or retrying the step.
- **Chose:** wait for the `load` event instead of `networkidle` in `site/scripts/chronicle.mjs`. The run on 2026-10-31 timed out at `waitForLoadState('networkidle')` even though `load` had fired, so a lingering request (not our page) failed the whole job. The walkthrough already pauses after each step, so the screenshots and video are unchanged.
- **Result:** Fixes the failing Chronicle run flagged in Health issue #995. Next scheduled run confirms.
