# 2026-11-06: Start a business and Which office read from fact records (#122)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #122 had two next steps: steps 3 and 6 of `/start-a-business/` (blocked by the city's 403 last night), and other pages that are not high stakes with typed facts. `/which-office/` (22 typed matches) came next on the list.
- **Chose:** both. The city's site answered this morning, and `/which-office/` is the site's "who do I call" page for local government.
- **Shipped:**
  - **`/start-a-business/`:** 4 new records in `content/facts/business/`: the city license and how to ask about it, and the B&O returns and who to ask. They come from the city's steps, permitting, Finance and B&O pages, re-read 2026-11-06. The page now has no typed phone numbers. One addition: the Finance page lists Licensing@morgantownwv.gov for license questions. One sentence came off: "Morgantown charges a B&O tax on business done inside city limits", because today's read of the B&O page did not say it in those words.
  - **`/which-office/`:** the 13 rows that were typed now read from fact records in `content/facts/offices/`. The sources are the county's contact directory, the Prosecuting Attorney's page, the Planning Office page and the Sheriff's services page, all re-read 2026-11-06. Each row shows its own checked date. One addition: the schools line now gives extension 507, as the county directory lists it. Rows from org and resource records are unchanged.
- **Scoreboard:** freshness. Typed phone numbers on these two pages went from about 46 matches to 0. Check that the Health check's on-time line counts the new records at the November 9 retro.
