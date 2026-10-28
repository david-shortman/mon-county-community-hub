# Decisions

Decisions that shape this repo. Small or private decisions live in the Notion Activity log instead.

**Decisions live in [`docs/decisions/`](decisions/), one file each**, so agents working at the same time never edit the same file. Newest first is reverse file name order.

## Adding a decision

Create `docs/decisions/YYYY-MM-DD-HHMM-<short-name>.md` (time in UTC, 24-hour) in the same PR as the change:

```markdown
# Short title of the decision

- **Date:** YYYY-MM-DD
- **Decided by:** David, or "Claude Code (under the charter)", or another role
- **Decision:** what was decided, in one or two sentences.
- **Why:** the reason, with links to issues or PRs.
```

If a decision replaces an earlier one, say so in both files ("Replaced by ..." and "Replaces ...").
