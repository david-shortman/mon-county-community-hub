# 2026-10-31: Search readiness check, and flyers kept out of search (#89)

- **Checked:** all 120 built pages, ready for when Google Search Console and Bing Webmaster Tools are set up (#89).
  - Every page has a unique title and a meta description, a canonical link that matches its own URL, and Open Graph tags (title, description, URL, image). `site/scripts/check-pages.mjs` already fails the build on a missing or repeated title, a missing description or a missing canonical link.
  - `robots.txt` allows every crawler and names the sitemap. The sitemap lists 100 pages.
  - Every page is linked from at least one other page (no orphans). JSON-LD parses on every page (`check-jsonld.mjs` also runs on each build).
- **Fixed:** the 19 printable flyers (`/community-centers/<place>/flyer/`) and the 404 page had canonical links to themselves, so search engines could list a print copy instead of the real page. They now say `noindex, follow` and have no canonical link. `Base.astro` has a new `noindex` prop for this.
- **Guard:** `check-pages.mjs` now fails the build if a page is neither in the sitemap nor marked noindex, or is both.
- **Not fixed here:** many titles and descriptions are longer than search results show (about 60 and 160 characters). They are unique and clear, so this is cosmetic; it is a follow-up issue, since it touches about 100 pages owned by many lanes.
