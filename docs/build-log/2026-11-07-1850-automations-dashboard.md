# 2026-11-07: Automations dashboard for every scheduled job

- **Considered:** having each cloud routine write a note to the dashboard at the end of its run, as the Maple and Spruce dashboard does. The hub's routines run with no connectors and their run logs show no tool that can write to a dashboard, so that step would fail every time.
- **Chose:** a daily sweep on David's Mac that reads each routine's run history, the scheduled GitHub Actions runs and the open `for:david` PRs, and files them on the dashboard. Sessions that can write to it may still drop one note in its inbox. Nothing about what the routines do changes. Cost: $0 beyond the sweep's own small daily run.
- **Shipped:** [`docs/operations/automations.md`](../operations/automations.md): all 17 scheduled jobs (6 cloud routines, 8 GitHub Actions schedules, PRs waiting on David, Claude Duet, the sweep), the report-the-run step, and the sweep's steps. The dashboard itself is private to David's account.
- **Scoreboard:** no resident-facing number. Check 2026-11-14 that the dashboard shows a week of runs with no job marked overdue by mistake.
