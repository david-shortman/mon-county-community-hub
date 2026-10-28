# 2026-10-28: Health workflow trimmed to the actions that already run

- **Considered:** the first Health run failed at startup. It was the only workflow using `actions/upload-artifact`, `actions/download-artifact`, and `actions/github-script`, so the allow list looked like the cause. Options: ask David to widen the allow list, or drop those actions. Later, two other new workflows (Chronicle and Claude review) also failed at startup while using only actions that work elsewhere, so the allow list may not be the whole story.
- **Chose:** drop them anyway. Fewer actions is safer and nothing here needs them. It removes one possible cause, and the run page error will settle the rest.
- **Shipped:** issue handling moved to `site/scripts/health-issue.mjs` (plain Node `fetch`), and the Claude job re-runs the check instead of downloading an artifact. Tested against a fake GitHub API: new failure, same failure again, and back to green. Waits for David, since it changes a workflow.
- **Scoreboard:** no change.
