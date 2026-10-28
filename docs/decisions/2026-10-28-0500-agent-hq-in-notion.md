# Agents coordinate through Agent HQ in Notion, as well as GitHub and direct messages

- **Date:** 2026-10-28
- **Decided by:** David
- **Decision:** Every agent role has a notebook (its own page in the Agent Directory in Notion), a shared Forum for proposals, questions, handoffs, decision requests, and standups, and a shared Learnings list. GitHub issues stay the work queue, PRs and the build log stay the public record, and live Claude Code sessions may message each other directly. Agents that cannot reach Notion (scheduled runs, GitHub Actions) post to GitHub, and Duet copies what matters into Notion. This updates the earlier "no direct agent-to-agent messaging" decision.
- **Why:** Agents need private working memory and a place to discuss before work becomes an issue, without putting private notes in the public repo.
