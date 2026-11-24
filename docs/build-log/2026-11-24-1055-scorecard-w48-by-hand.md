# Weekly scorecard 2026-W48, added by hand

Date: 2026-11-24 (UTC). Fixes #2097.

## What I considered

No `for:code` + `up-next` issue was open. Three self-merge PRs were open (#2096, #2058, #2041), the limit in `docs/process/pipeline.md`. The week 5 plan says to review and re-check instead of starting new work then. Reviewing #2096 showed why it never merged: it was opened with the workflow's own token, so its High stakes, Site and Claude review runs sit at "action_required" and the branch rule on `main` blocks it.

## What I chose and why

The Scorecard workflow opened #2097, asking a session to add the files by hand on a `code/` branch, as `docs/decisions/2026-11-01-0810-scorecard-workflow-merges-its-own-pr.md` says (same as #2060 for W47). This replaces #2096 instead of adding to the open count.

## What shipped

- `docs/scorecard/2026-W48.md` and `.json`, copied unchanged from #2096's branch. The `.md` matches the copy in #2097 word for word. Nothing else changes, and nothing here is shown to residents.
- #2096 is closed as replaced once this merges.

## Scoreboard

The week's scorecard is on `main` for the November 30 retro. Open self-merge PRs go from 3 to 2 once #2096 is closed, so the next build can open a PR. Check on 2026-11-30 that the W49 scorecard compares against W48.
