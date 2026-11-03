# 2026-11-03: Findability for six newer pages (#1612, #529)

- **Considered:** pages added in waves 9 to 11 that are on `main`: `/identity-theft/`, `/which-office/`, `/home-calendar/`, `/grow/`, `/sell-what-you-grow/` and `/progress/`. For each we checked its door and the Topics page, the sitemap, `llms.txt`, links from related pages, "Also called" words, and title and description length (about 60 and 160 characters, from the 2026-10-31 shorter titles work).
- **Found:** all six were in their door, the Topics page, the sitemap and `llms.txt`. `/which-office/` had links from only 2 other pages and `/identity-theft/` from 3. None had "Also called" words. Two titles and five descriptions were too long for a search result.
- **Shipped:**
  - "Also check" links: Which office from Who decides and Public records; Identity theft from Scams (and back); Home calendar from Burning (and on to Property tax, Burning and Grow).
  - "Also called" words for Identity theft, Which office, Home calendar, Grow and Sell what you grow, each a word the page answers.
  - Shorter titles for Which office (73 to 58 characters) and Our checks (78 to 57), and descriptions of 160 to 170 characters for all six.
  - 18 new search test queries and 3 new findability questions (q63 to q65).
- **Search test:** the 18 new queries went from 15 to 16 in the top 3 ("home maintenance calendar" now finds the Home calendar). Still missed: "gardening" (Grow is 4th, after Soil test, Plant problems and For homeowners) and "when should I plant my garden".
- **Skipped for now:** links on pages that wait for David (Property tax, Who serves me, Legal help). They go in one batched `for:david` PR.
- **Cost:** $0.
