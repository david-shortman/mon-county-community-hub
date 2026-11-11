# 2026-11-11: Shorter titles and descriptions for the helper cards (#939)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - The week 3 plan's open build items wait for David or are blocked.
  - For #122, I listed pages that still have typed checked dates. The ones left were already sent to David (fees on `/selling-food/`, tax on `/business-by-town/`) or touch high-stakes topics (school meals, child care aid, COVID advice).
  - #939's last update named a next step that is not high stakes: the `for/helpers/` pages, with descriptions up to 347 characters.
- **Chose:** #939's helper cards. Search results cut titles at about 60 characters and descriptions at about 155. One template change fixes six pages.
- **Shipped:**
  - `site/src/pages/for/helpers/[role].astro`:
    - The title is now "Helper card for nurses in Mon County, WV", using the role's first word group, down from "Card for nurses and health workers in Mon County: what to do when someone asks".
    - The description is one line, about 150 characters, instead of every situation on the card joined together (up to 347).
  - The index page, `/for/helpers/`, has a shorter title and description too.
- **Measured:** page titles over 70 characters went from 107 to 101. The site search test is unchanged at 284 of 289.
- **Next for #939:** the high-stakes pages (`after-you-apply/*`, `help/what-help/*`) in a `for:david` batch. Those hold the longest titles now (up to 101).
- **Scoreboard:** the number of titles over 70 characters (`check-pages` note). It helps once #89 gets the site into search. Check at the November 16 retro.
- **Cost:** $0.
