# 2026-11-10: Noise rules page says the city's source is gone (#122, #1782)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - The week 3 plan items left are shelter, housing, food or benefits work, which waits for David, or are blocked.
  - #122's next page, `/noise/`, was the chunk for this run: move its quiet hours, party waiver and fines into fact records.
- **Found:** the city's Noise Ordinance page, `/noise/`'s only source, now returns "page not found". It is gone from the city's sitemap, but the city's menus still link to it. The city's official code is on Municode, which refuses automated reads. So no current official page we can read confirms the rules today.
- **Chose:** not to move the quotes into fact records with a new checked date, since that would claim a check we could not make. Not to delete the section either: deleting published content waits for David, and nothing shows the rules are wrong. Instead, the page now says what happened.
- **Shipped:**
  - `/noise/`:
    - A "Check before you rely on this" note: the city removed its page, it was gone on November 10, and the quotes are from our October 31 read.
    - Links to the City Code on Municode.
    - Every source line now says "may be out of date".
  - #1782 (`needs-verification`, for David: compare the quotes with Article 527 in a browser, or ask the City Clerk).
  - A discovery file: `docs/discoveries/2026-11-10-noise-ordinance-page-gone.md`.
- **Next for #122:** `/noise/` waits on #1782. The next page that is not high stakes needs to be picked from the pages with typed facts.
- **Scoreboard:** freshness. One page now says plainly that its source is gone, instead of showing a checked date for a dead link. Check at the November 16 retro.
- **Cost:** $0.
