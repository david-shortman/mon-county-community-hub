# 2026-10-28: Visibility foundation

- **Considered:** hand-written sitemap vs the Astro sitemap integration; checking pages in CI vs in the health script.
- **Chose:** the official integration, and a post-build check so the existing CI build enforces it without workflow changes.
- **Shipped:** sitemap, `robots.txt`, `llms.txt`, canonical links, Open Graph tags, share image, unique home and calendar titles, `npm run check-pages` (runs after build), and `docs/visibility/README.md`. Closes #87. Structured data stays in #37. `robots.txt` only works at the host root, so it needs the custom domain in #89.
- **Scoreboard:** Level 1 findability (5 of 32 questions had a local answer in the top 3). Re-run the question tests after the site is indexed, about 2026-11-18.
