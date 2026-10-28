# 2026-10-28: Proposed health workflow (waits for David)

- **Considered:** running Claude on every health check (simple, but costly when nothing is wrong) versus running the free check often and calling Claude only when there is something new to fix.
- **Chose:** the second. `.github/workflows/health.yml` runs the check every 4 hours and after each Site run on `main`, keeps one pinned Health issue, and starts Claude only for new failures an agent can fix.
- **Shipped:** the workflow, proposed in a `for:david` PR since workflow changes wait for David. The runbook describes how it works.
