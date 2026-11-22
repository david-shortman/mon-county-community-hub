# Weekly scorecard 2026-W47, added by hand

Date: 2026-11-16 (UTC). Fixes #2056.

## What I considered

No `for:code` + `up-next` issue was open. Four self-merge PRs were already open, over the limit of three in `docs/process/pipeline.md` ("Finish or close before starting more"). So this run finishes stuck work instead of starting new work.

## What I chose and why

The Scorecard workflow opened #2055 but could not merge it. GitHub does not run other workflows on a PR made with a workflow's own token. So the High stakes check never runs, and the branch rule on `main` blocks the merge. The workflow then opened #2056, asking a session to add the files by hand on a `code/` branch (`docs/decisions/2026-11-01-0810-scorecard-workflow-merges-its-own-pr.md`).

## What shipped

- `docs/scorecard/2026-W47.md` and `.json`, copied unchanged from #2055's branch. They match the files in #2056 word for word. Nothing else changes, and nothing here is shown to residents.
- #2055 is closed as replaced by this PR once it merges.

## Scoreboard

The week's scorecard is on `main` for the November 23 retro. Open self-merge PRs go from 4 to 3 once #2055 is closed. Check on 2026-11-23 that the W48 scorecard compares against W47.
