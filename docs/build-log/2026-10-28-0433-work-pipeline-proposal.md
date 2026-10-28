# 2026-10-28: Proposed work pipeline and review gate (waiting for David)

- **Considered:** where the current loop (Duet ranks, a Claude Code session builds and self-merges) could stall, duplicate work, drift from the charter, ship low quality, or go unmeasured.
- **Chose:** a written pipeline with eight stages, a public scoring formula for ideas, an automatic review against the design rubrics for anything residents see, and a weekly retrospective. These change how agents work, so they wait for David.
- **Shipped (proposed, not merged):** `docs/process/pipeline.md` and `.github/workflows/claude-review.yml`. Suggested edits to `docs/COORDINATION.md` are in the PR description.
- **David's answers:** start with a soft gate (a rule agents follow, not a required check), run the weekly retrospective as a scheduled Claude Code session, and split the build log into one file per entry. All three are now in this PR, including moving every existing entry into `docs/build-log/`.
- **Scoreboard:** no direct change. If adopted, every build names the metric it should move and a date to check it, and the retrospective reports pipeline health weekly.
