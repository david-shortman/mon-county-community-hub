# 2026-11-02: Work pipeline marked adopted (#1410, part 2)

- **Considered:** the second part of #1410, David's November 2 answers on the work pipeline (#96). It changes how agents work, so it waits for David. Scheduled runs may not edit `docs/COORDINATION.md`, so the 3-day claim rule for that file is written out in the PR for David to add.
- **Chose:** the pipeline doc says adopted by David; the 1 to 5 score is the standard; the `up-next` limit points to `docs/operations/budget.md` as the one rule; claims expire after 3 days with no PR (was 24 hours), matching the Health check; a note that model and product quality bars wait until a tool answers residents in words a person did not write. The Task issue form gets two required fields: the resident question it answers, and how we will know it worked. The `type:process` label already exists.
- **Shipped:** `docs/process/pipeline.md`, `.github/ISSUE_TEMPLATE/task.yml`.
- **Scoreboard:** week 2 goal 6 (claims are honest). Check at the November 9 retro that no claim sits over 3 days without a PR.
