# 2026-10-28: Actions outage resolved

- **Considered:** the health check's first FAIL: every Actions run failing at startup (#66).
- **Chose:** wait for David, since it was a repo setting agents cannot see or change.
- **Shipped:** David allowed actions created by GitHub plus `anthropics/claude-code-action`. Runs passed right away. The health check now reads WARN with nothing failing. The incident file is resolved, and the runbook notes the allowed-actions rule for new workflows.
- **Scoreboard:** no change. The live calendar now has 45 upcoming events, up from 7, because the feeds from #53 deployed.
