# 2026-11-08: Have your say reads meeting times and comment rules from fact records (#122)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #122's next page was `/have-your-say/`, which yesterday's run left as a bigger change.
  - It tells people when five public bodies meet and how to comment. A wrong time or rule there sends someone to the wrong meeting.
- **Chose:** move the City Council, County Commission, BOPARC and Planning Commission cards to fact records.
- **Shipped:** 14 records in `content/facts/meetings/`, re-read 2026-11-08, each with the source's words. The sources:
  - **City Council:** the city's Council page and Clerk page; the November 10, 2026 agenda for the "public portion" wording; and the Council's electronic meetings policy. The policy is a scanned PDF, read page by page. It was adopted May 6, 2025.
  - **County Commission:** the Commission's page.
  - **BOPARC:** boparc.org's meetings and contact pages, and the January 14, 2026 agenda for the comment rules.
  - **Planning Commission:** the city's Planning Commission page.
  
  Each card's source line lists its records' sources, and it says "may be out of date" when any record is due.
- **Changed for readers:**
  - Council's Committee of the Whole now says "takes no formal action", the page's words, instead of "does not vote".
  - The BOPARC card adds City Hall's street address.
  - The Planning card now says minutes go up after they are approved. It used to say before each meeting, which the page does not say.
- **Not changed:** the school board card. Its page loads its text by script and BoardDocs refused the read, so it keeps its October 30 date.
- **Noticed:** the city's Clerk page links the Council's electronic meetings policy as "2020 City Council Policy...", but the document says it was adopted May 6, 2025. That is a small label mismatch in the public record (see `docs/discoveries/2026-11-08-council-policy-link-year.md`).
- **Scoreboard:** freshness. `/have-your-say/` has no typed meeting times left, except the school board's. Check at the November 9 retro.
