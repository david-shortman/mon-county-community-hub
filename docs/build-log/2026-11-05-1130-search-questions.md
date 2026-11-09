# 2026-11-05: Search: full questions find the right page more often (#1676)

- **Considered:**
  - #1732: the city's site answers again, but the Housing Advisory Commission page now returns 404, so it stays off the site.
  - #1461 is already done.
  - #1676 was waiting on #1650 and #1647, and both are now closed.
  - Question searches were the weakest kind in the search test (36 of 41).
- **Chose:** part 1 of #1676 (full questions). It changes only the shared search code, and the search test scores every change.
- **Shipped:** in `site/src/lib/search-plan.mjs`:
  - **More filler words:** common small words in a question ("but", "have", "has", "there", "should", "would", "could", "if", "so", "go", "their", "them", "they" and a few more) no longer pull in long pages. "will" stays, so "living will" still works.
  - **Less weight for the whole sentence:** in a search of 4 or more words, the whole sentence as typed counts 0.3 instead of 1. Short searches like "WV WORKS" keep full weight, since "wv" is filler but matters there.
  - Unit tests and `docs/operations/search-test.md` are updated, and the run is saved in `content/findability/search-runs/`.
- **Measured:** the search test went from 274 to 277 of 289 (94.8% to 95.8%). Questions went from 36 to 39 of 41, and no kind went down. Now found:
  - "I need a dentist but have no insurance"
  - "where do I get narcan"
  - "when should I plant my garden"
- **Still missing:**
  - "is there lead in my old house" and "how do I pick a nursing home for my mom"
  - the short common words in part 2 ("free food", "gardening")
  - the content gaps in part 4
- **Scoreboard:** site search test, question kind: 87.8% to 95.1%. Check again at the Sunday findability run (November 8).
- **Also:** re-read the city's vacancy list (it answered today). MUB, the Transit Authority and the Housing Authority board each still show 1 open seat, so their cards now say checked November 5 (#1732).

Checked 2026-11-08: question kind is now 100% (41 of 41) in the top 3, and 97.6% for all 289 queries. [Run](../../content/findability/search-runs/2026-11-08-2349.json).
