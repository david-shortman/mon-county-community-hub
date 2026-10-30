# Measurement plan: hub answer pages show up in search

- **Written:** 2026-10-30, before the end-of-sprint findability recheck
- **Change:** the answer pages shipped in the October 30 to November 1 backlog sprint (#529), and the leading measure added to `score.py` (#110)
- **Author:** Claude Code

## Question

When a resident searches one of our 32 findability questions in plain words, does a hub page that answers it show up?

## Level

1 Findability.

## Main measure

The number of findability questions where `hub_in_results` is `true`: a hub page showed up in the plain or the reworded search. Counted by `python3 content/findability/score.py <run file>` ("Hub page showed up in search").

## Baseline

0 questions, on 2026-10-28 (same-day recheck, [`content/findability/2026-10-28b.yaml`](../../content/findability/2026-10-28b.yaml)). At that time 6 of 32 questions had a hub answer page, and none showed up in search.

## Check date

2026-11-15. New pages usually take days to weeks to be indexed, so the 2026-11-01 Sunday run and the end-of-sprint recheck are early looks, not the result.

## What counts as "helped"

- **Helped:** a hub page shows up in search for at least 3 questions on the check date.
- **Some sign:** 1 or 2 questions.
- **No change:** 0 questions. That would most likely mean the pages are not indexed yet, not that they are bad answers. The next step would then be the search engine accounts and domain decision (#89).

## Quality of the answer and use of it

- **Answer quality:** every hub page counted here must have a source and a checked date on each fact (the build checks enforce this), and its findability note must say the page answers the exact question.
- **Use:** not measurable yet. The site has no analytics, which is David's decision (#41).

## What else could explain a change

- Search engines index new sites on their own schedule. A jump may reflect indexing timing more than page quality.
- The search tool we use is not Google on a resident's phone, and results vary by day.
- Search engine accounts (#89) would speed indexing. If they are set up before the check date, say so in the result.

## Exploratory measures

- The leading measure: how many questions have a hub answer page at all.
- Whether any official page links to a hub page.
- The overall findability score. It should move only after hub pages show up in search.

## Counting rules

Follows the [shared counting rules](README.md#shared-counting-rules). These are counts of questions, not people, so small numbers are shown as they are.

## Changes

None yet.

## Result

Not yet checked.
