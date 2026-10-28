# YYYY-MM-DD: Short name of the incident

Copy this file to `YYYY-MM-DD-short-name.md` and fill it in once the problem is fixed. Keep it plain and blameless: describe what happened, not who to blame. No private information.

- **Status:** resolved / monitoring
- **Started:** YYYY-MM-DD HH:MM UTC (when it began, if known)
- **Noticed:** YYYY-MM-DD HH:MM UTC, by (health check, session name, resident report)
- **Fixed:** YYYY-MM-DD HH:MM UTC
- **Health checks that caught it:** (for example `actions-main`, `deploy-fresh`)
- **Links:** issue #, fix PR #

## What happened

A few sentences on what went wrong, in order.

## Impact on residents

What residents saw or missed, for how long, and roughly how many pages or entries. Say "none" if no resident could have noticed. Examples: the site was down, a deadline was missing or wrong, the calendar feed stopped updating, merged fixes did not go live.

## Cause

The root cause, as far as we know. If it is not known yet, say so.

## Fix

What was changed to fix it, with links.

## Prevention

What we changed, or will change, so it does not happen again or so we notice sooner. Link any follow-up issues. If a health check could have caught it sooner, add or tune that check.
