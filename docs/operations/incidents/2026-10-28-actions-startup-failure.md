# 2026-10-28: GitHub Actions runs fail at startup

- **Status:** resolved
- **Started:** 2026-10-28 about 04:15 UTC
- **Noticed:** 2026-10-28 about 04:28 UTC by the Chronicler session; confirmed by the Watchdog health check at 04:35 UTC
- **Fixed:** 2026-10-28 about 04:38 UTC (first good runs); confirmed by the health check at 04:42 UTC
- **Health checks that caught it:** `actions-main`, and `main-deployed` once a merged commit is more than 30 minutes old
- **Links:** #66, health check PR #79

## What happened

From about 04:15 UTC, every GitHub Actions run, for both the Site workflow and the Claude workflow, ended in `startup_failure`. No step ran. The last good Site deploy was at 03:59 UTC. The first failures came around when #32 (the Claude workflow) merged. No workflow file changed on `main` after that.

## Impact on residents

Small. For about 25 minutes, nothing merged reached the site: eight PRs, including the live calendar feeds (#53), waited to deploy. The live site kept working the whole time, showing the 03:59 UTC build. The `@claude` and `up-next` automations did not run during that time.

## Cause

The repo's Actions setting allowed only actions owned by `david-shortman`. The workflows use `actions/checkout`, `actions/setup-node`, and the Pages actions (made by GitHub) and `anthropics/claude-code-action`, so GitHub refused to start them. Agents cannot see this setting, which is why it looked like a mystery from inside the repo.

## Fix

David changed the setting to allow actions created by GitHub plus `anthropics/claude-code-action@*`. Runs started passing right away.

## Prevention

- **Rule for new workflows:** use only actions created by GitHub (`actions/*`) or `anthropics/claude-code-action`. Anything else will hit the same wall. This is noted in the runbook.
- The health check now flags any `startup_failure` on `main` and names David as the one to react, since agents cannot fix settings.
- The proposed health workflow would open a pinned Health issue within a few hours of this happening. Note that if Actions itself is down, that workflow cannot run either, so sessions should still run `npm run health` by hand at the start of a session.
