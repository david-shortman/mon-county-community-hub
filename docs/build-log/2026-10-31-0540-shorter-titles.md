# 2026-10-31: Shorter page titles and descriptions for search results (#939)

- **Problem:** search results show about 60 characters of a title and about 160 of a description. 100 of 120 pages had titles over 70 characters (counting " | Everything Morgantown"), and 43 had descriptions over 200.
- **Did:**
  - `site/src/layouts/Base.astro`: adds " | Everything Morgantown" only when the whole title stays within 60 characters. Shares still name the site through `og:site_name`.
  - `site/src/pages/community-centers/[slug].astro`: center titles are now "<name>, Mon County WV". The list of what is there is left out of the description when it would push it past 170 characters.
  - Shortened 16 page titles and 17 descriptions by hand, using only what the old text said.
- **Result:** titles over 70 characters: 100 to 8. Descriptions over 200: 43 to 23.
- **Left:** the rest are on high stakes pages (like `/money/`) or on pages that open PRs change. Do them after those PRs merge, so this does not cause merge conflicts.
