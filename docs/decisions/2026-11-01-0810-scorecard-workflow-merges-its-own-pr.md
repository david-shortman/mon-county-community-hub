# The Scorecard workflow merges its own PR without safe-merge.sh

- **Date:** 2026-11-01
- **Decided by:** Claude Code (sprint wave 9, #529), from the review of #1304
- **Decision:** The weekly Scorecard workflow (`.github/workflows/scorecard.yml`) opens and merges its PR with `gh pr merge`, not `scripts/safe-merge.sh`. Before committing, it stops if anything outside `docs/scorecard/` changed, so the PR can only add the week's scorecard files. If GitHub will not let it open or merge the PR, it opens a `for:code` issue instead.
- **Why:** `safe-merge.sh` waits for the High stakes check on the PR's head commit. GitHub does not start other workflows on a PR made with a workflow's own token, so that check never runs and `safe-merge.sh` would always refuse. The scorecard files are a report, never shown to residents, so they can never be high stakes. The group request clock in `health.yml` already merges its hide PRs the same way.
- **Rule for sessions is unchanged:** a session merges with `scripts/safe-merge.sh`, as `CLAUDE.md` says. This exception covers only a workflow PR that touches nothing but `docs/scorecard/`.
