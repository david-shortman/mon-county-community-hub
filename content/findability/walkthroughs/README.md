# Simulated resident walkthroughs

**Simulated, not real residents.** Claude Code walks made-up resident tasks on the built site at phone width, the way a stressed person might: from the home page by tapping, and from the site search. This finds dead ends, missing links and search misses. It is not resident feedback and is never reported as such.

- `tasks.yaml`: the tasks. Each comes from a resident group (`docs/groups/`), a need on the needs register (`content/needs/`) or a findability question.
- `walk.js`: runs the tasks with Playwright at 390 by 844 and saves raw measures as JSON.
- `score.py`: turns the raw measures into 0 to 3 scores tied to rubric criteria (IA1, IA2, IA7, PL1, TR1, II1 in `docs/rubrics/`), and summarizes a results file.
- `YYYY-MM-DD.yaml`: one run's results, with notes per task.

To run it again: build the site (`npm ci && npm run build` at the repo root), serve `site/dist` on port 4321, then from the repo root:

```
node content/findability/walkthroughs/walk.js content/findability/walkthroughs/tasks.yaml
python3 content/findability/walkthroughs/score.py build content/findability/walkthroughs/tasks.yaml walkthroughs-raw.json > content/findability/walkthroughs/YYYY-MM-DD.yaml
```

Then add notes per task by reading each answer page. Keep task ids stable so runs compare. The first run and what it found: `docs/reviews/2026-10-31-simulated-walkthroughs.md`.

## November 1 rerun (#529, wave 8)

- `tasks-new-pages.yaml`: 20 more tasks (ids n01 to n20) for pages added October 31 and November 1 (after you apply guides, life events, towns, `/for/` pages, parking, protective orders, mortgage help, holidays, agendas, Find your people). Same format and scripts.
- `page-search.js`: runs the 246 search test queries through the real `/search/` page in a browser, since `npm run search-test` scores shared code the page does not fully use.
- Results: `2026-11-01.yaml` (the 30 tasks) and `2026-11-01-new-pages.yaml` (the 20). Write-up: `docs/reviews/2026-11-01-simulated-walkthroughs-rerun.md`.

## November 3 persona walkthroughs (#1533, wave 11)

- `tasks-personas.yaml`: one task per persona in `content/personas.yaml` (ids p01 to p32), using the persona's findability question, search words and landing page. `after_path` holds the new landing for five personas changed in #1540.
- Results: `2026-11-03-personas.yaml`, with `landing_answers` (Claude's read of whether the landing page answers the question). Write-up: `docs/reviews/2026-11-03-persona-walkthroughs.md`.

## November 3 round 4 (sprint wave 14, see #529)

- Same 32 persona tasks, run with `--after` on `main` after about 96 more commits, plus the Family door tasks. Results: `2026-11-03-personas-round-4.yaml`, with each task's round 3 total for comparison. Write-up, with the search test: `docs/reviews/2026-11-03-walkthroughs-and-search-round-4.md`.
