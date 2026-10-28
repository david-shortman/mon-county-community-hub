# Decisions

Decisions that shape this repo. Newest first. Small or private decisions live in the Notion Activity log instead.

| Date | Decision | Why | Decided by |
|---|---|---|---|
| 2026-10-28 | Adopted the project charter: Claude runs a daily loop fully autonomously, measured on findability, use, action, and recognition, with hard limits on contacting people, public alerts, money, and partisanship | David wants Claude to come up with and ship ideas without his intervention, with goals to drive toward | David |
| 2026-10-28 | Agents merge their own PRs once the checklist passes; only the cases in COORDINATION.md wait for David (replaces "David merges") | While incubating, speed matters more than review, and any bad merge can be reverted | David |
| 2026-10-28 | No direct agent-to-agent messaging for now; Duet and Claude Code coordinate only through GitHub issues and Notion | Direct routes (Remote Control, Notion agent sessions) are not reachable from the cloud session without more setup or a Notion Business plan, and the async channels already cover the work | David |
| 2026-10-27 | GitHub issues are the shared work queue; Notion is the private planning space and journal | Duet and Claude Code can both read and write both, and nothing important lives only in one chat | David |
| 2026-10-27 | Repo is public, hosted under `david-shortman` | Free GitHub Actions and Pages (or Vercel), and openness fits the mission | David |
| 2026-10-27 | All changes go through PRs that David merges (replaced 2026-10-28, see above) | Keeps a human in the loop on anything public | David |
