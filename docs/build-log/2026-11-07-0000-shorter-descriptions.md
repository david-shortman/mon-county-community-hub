# 2026-11-06: Shorter descriptions for search results (#939, first batch)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #939 (shorter titles and descriptions) is item 9 on the week 2 plan. Its claim from October 31 had no PR for over 3 days, so per #1410 this run took it over.
  - Measured on the built site: 107 titles over 70 characters and 137 descriptions over 170. Most are in two templates: group pages (70 long descriptions, 45 long titles) and town pages (all 11).
- **Chose:** the town template, 12 guide pages that are not high stakes, and a note in `check-pages`.
- **Shipped:**
  - **Town pages:** descriptions are about 135 characters, down from about 190.
  - **12 guides:** descriptions are now 133 to 148 characters, down from 171 to 202. The pages are bus routes, when someone dies, pay for training, selling food, start a business, public records, use our data, family court, kids with disabilities, school-age kids, find a job and legal help. Each keeps the words people search for first.
  - **`check-pages`:** prints a note (never an error) with the count of titles over 70 characters and the five longest.
- **Not here:** the group page template's `<Base>` line also carries `crisis={crisis}`, so changing it trips the High stakes check. That change ("<name>, Mon County WV" titles and a shorter description) is a separate PR for the owner. High-stakes pages also wait for the owner.
- **Scoreboard:** findability. Descriptions over 170 characters drop by 23. Check the Wednesday visibility run once search accounts (#89) exist.
