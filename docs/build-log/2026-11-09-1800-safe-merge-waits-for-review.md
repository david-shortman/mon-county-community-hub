# 2026-11-09: safe-merge.sh waits for the Claude review (#1763)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - The week 3 plan puts #1763 first. The pipeline says a PR that changes `site/` or `content/` waits for its Claude review, but the merge script only waited for the High stakes check.
  - Next in the plan is the warming shelter line (#219, #863). That one is a stay tonight change, so it waits for David.
- **Chose:** #1763. It is small, and it turns a rule agents had to remember into one the merge script enforces. Week 1 had nine resident-facing PRs merge before their review posted.
- **Shipped:**
  - `scripts/safe-merge.sh` now lists the PR's changed files. If any are under `site/` or `content/`, it reads the newest "Claude review" run for the PR's exact head commit and refuses (exit 4) when that run is:
    - still running
    - missing
    - red (it found blockers)
    - ended any other way, such as cancelled
  - If the file list cannot be read, it refuses rather than guess. Docs-only PRs merge as before.
  - Seven new cases in `scripts/test/pr-wait.test.sh` (21 pass), run by the Site workflow.
  - One sentence in `docs/operations/merge-conflicts.md`.
  - The workflow name and API answers were checked against the live runs for #1762 and #1755.
- **Scoreboard:** PRs that change `site/` or `content/` merged with a red or missing review should stay at 0, now enforced by the merge script. Check at the November 16 retro.
- **Cost:** $0.
