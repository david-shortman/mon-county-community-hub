# 2026-10-28: GitHub Actions runs fail at startup

- **Status:** open, waiting on David (#66)
- **Started:** 2026-10-28 about 04:15 UTC
- **Noticed:** 2026-10-28 about 04:28 UTC by the Chronicler session; confirmed by the Watchdog health check at 04:35 UTC
- **Fixed:** not yet
- **Health checks that caught it:** `actions-main`, and `main-deployed` once a merged commit is more than 30 minutes old
- **Links:** #66

## What happened

From about 04:15 UTC, every GitHub Actions run, for both the Site workflow and the Claude workflow, ended in `startup_failure`. No step ran. The last good Site deploy was at 03:59 UTC. The first failures came around when #32 (the Claude workflow) merged. No workflow file changed on `main` after that.

## Impact on residents

So far, small. The live site still works and shows the calendar as of the 03:59 UTC build. But nothing merged after that is live, and if this lasts past the morning rebuild, past dates will stop dropping off the calendar. The `@claude` and `up-next` automations are also not running.

## Cause

Not known yet. A startup failure with unchanged workflow files usually points to a repo or account setting (allowed actions, workflow permissions, an Actions spending limit) or a GitHub outage. Agents cannot see these settings.

## Fix

Pending. David to check Settings > Actions > General and the account's Actions billing, then re-run the latest Site run on `main` (see #66).

## Prevention

- The health check now flags any `startup_failure` on `main` and names David as the one to react, since agents cannot fix settings.
- The proposed health workflow would open a pinned Health issue within a few hours of this happening. Note that if Actions itself is down, that workflow cannot run either, so sessions should still run `npm run health` by hand at the start of a session.
