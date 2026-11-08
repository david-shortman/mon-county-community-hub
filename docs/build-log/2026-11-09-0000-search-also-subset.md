# 2026-11-08: Search: every full question in the test now finds its page (#1676)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #1676 still had two question misses: "is there lead in my old house" and "how do I pick a nursing home for my mom".
  - The rest of #122's pages hold stable state rules.
- **Chose:** the two question misses. Questions are what most residents type.
- **Shipped:**
  - `alsoHit()` in `site/src/lib/search-plan.mjs` now also counts an "Also called" entry when every one of its topic words, three or more, was typed. So "lead in an old house" matches "is there lead in my old house". Short entries still need an exact match, so a two-word entry does not pull a page up for any search that happens to contain both words.
  - Two Also called entries, on pages that cover them and are not high stakes:
    - "lead in an old house" on `/lead/`, which covers lead-safe work on pre-1978 homes
    - "pick a nursing home" on `/choosing-a-care-home/`
  - A unit test, `docs/operations/search-test.md`, and a saved run (`content/findability/search-runs/2026-11-08-2349.json`).
- **Measured:** the search test went from 280 to 282 of 289 (97.6%). Questions went from 39 to 41 of 41, and no kind went down.
- **Still missing (7):**
  - four content gaps that need sourced facts first: AA meetings, stolen SNAP benefits, DMV hours, bulk trash
  - "abuse", which should put Stay tonight first and is a crisis-word question for the owner
  - "city council" and "county commission", where the agenda pages rank above Have your say, which may be fine
- **Scoreboard:** site search test 97.6%, questions 100%. Check at the November 15 findability run.
