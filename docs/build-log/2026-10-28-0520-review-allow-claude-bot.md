# 2026-10-28: Let the review check review Claude's own PRs

- **Considered:** the first end-to-end instant build (#77 to PR #91). The build worked, but the Claude review refused to run: "Workflow initiated by non-human actor: claude (type: Bot)."
- **Chose:** allow the `claude` bot in the review workflow only. The build workflow (`claude.yml`) still ignores bot-triggered events, so Claude's own labels and comments cannot start new builds in a loop.
- **Shipped:** `allowed_bots: claude` in `.github/workflows/claude-review.yml`.
- **Scoreboard:** pipeline measure: every Claude-built PR gets a review. Check in the 2026-11-02 retro.
