# 2026-11-03: Crisis words in site search show the 988 box and put Mental health first (#1647)

- **Considered:** "suicide" on `/search/` listed two group pages and `/grief/` before `/mental-health/`, and "suicidal" put `/grief/` first. David chose both fixes from #1647 on November 3.
- **Shipped (waits for David, crisis help):**
  - `CRISIS` in `site/src/lib/search-plan.mjs`: a short list of crisis words and phrases (suicide, suicidal, kill myself, end my life, want to die, self harm, overdose, and a few variants and misspellings). The search page shows the crisis line's 911 and 988 box (`CrisisLine.astro`, same component and words) above the results, in a live region. It shows before the search loads. With JavaScript off, the search page always shows the box.
  - `PIN`: for the suicide and self harm words, `/mental-health/` goes first. Overdose keeps `/drugs-and-alcohol/` first.
  - Search test: a query can say `first: true`; "suicide" uses it, and "suicidal", "kill myself" and "sucide" are new. The rule is written up in `docs/operations/search-test.md`.
  - Misspellings "sucide", "suicde" and "suiside" now search as "suicide".
- **Cost:** $0.
