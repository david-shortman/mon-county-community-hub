# Simulated resident walkthroughs

**Simulated, not real residents.** Claude Code walks made-up resident tasks on the built site at phone width, the way a stressed person might: from the home page by tapping, and from the site search. This finds dead ends, missing links and search misses. It is not resident feedback and is never reported as such.

- `tasks.yaml`: the tasks. Each comes from a resident group (`docs/groups/`), a need on the needs register (`content/needs/`) or a findability question.
- `walk.js`: runs the tasks with Playwright at 390 by 844 and saves raw measures as JSON.
- `score.py`: turns the raw measures into 0 to 3 scores tied to rubric criteria (IA1, IA2, IA7, PL1, TR1, II1 in `docs/rubrics/`), and summarizes a results file.
- `YYYY-MM-DD.yaml`: one run's results, with notes per task.

To run it again: build the site (`npm ci && npm run build` in `site/`), serve `site/dist` on port 4321, then from the repo root:

```
node content/findability/walkthroughs/walk.js content/findability/walkthroughs/tasks.yaml
python3 content/findability/walkthroughs/score.py build content/findability/walkthroughs/tasks.yaml walkthroughs-raw.json > content/findability/walkthroughs/YYYY-MM-DD.yaml
```

Then add notes per task by reading each answer page. Keep task ids stable so runs compare. The first run and what it found: `docs/reviews/2026-10-31-simulated-walkthroughs.md`.
