# 2026-11-05: Search: "Also called" words that match the search put their page first (#1676)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #1676 part 2 (short common words) was the next step left on the issue this morning.
  - "free food" ranked `/cottage-food/` first, and "gardening" ranked `/soil-test/` first, even though `/help/food/` and `/grow/` list those exact words under "Also called".
- **Chose:** part 2 of #1676. Pagefind already weights the Also called line, but long pages with the same words still won.
- **Shipped:**
  - `AlsoCalled.astro` puts its words in the search index as an `also` field (`data-pagefind-meta`). The visible line is unchanged.
  - In `site/src/lib/search-plan.mjs`, a new `alsoHit()` moves a result first when one of its Also called entries is exactly the topic words typed, in the reader's words or in our pages' words. Crisis pins still come before it.
  - A unit test, a note in `content/also-called.yaml` that an entry should belong to one page only (none is shared today), `docs/operations/search-test.md`, and a saved run in `content/findability/search-runs/2026-11-05-1750.json`.
- **Measured:** the search test went from 277 to 280 of 289 (95.8% to 96.9%), and everyday searches from 207 to 210 of 216. No kind went down. Now found: "free food", "gardening" and "police non emergency".
- **Still missing (9):**
  - "is there lead in my old house" and "how do I pick a nursing home for my mom"
  - "city council" and "county commission" (the agenda pages rank above Have your say)
  - the content gaps in part 4: AA meetings, stolen SNAP benefits, DMV hours, bulk trash
- **Scoreboard:** site search test, 96.9% (top 3). Check again at the Sunday findability run (November 8).
