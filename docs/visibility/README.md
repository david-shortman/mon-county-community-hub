# Visibility

If our help is digital, people have to be able to find it. This page explains the technical basics the site ships so search engines and AI answer tools can find, read, and correctly describe it. Source issue: #87.

## What the site does

| Piece | Where | Why |
|---|---|---|
| `sitemap-index.xml` | Made by `@astrojs/sitemap` (see `site/astro.config.mjs`) | Lists every page so crawlers do not have to guess. |
| `robots.txt` | `site/src/pages/robots.txt.js` | Allows crawling and points to the sitemap. |
| `llms.txt` | `site/src/pages/llms.txt.js` | A short plain description of the site for AI tools. Also tracked in #72. |
| Title and description | `site/src/layouts/Base.astro`, set per page | Each page has its own title and a one-sentence description, written the way a resident would search. |
| Canonical link | `Base.astro` | Tells search engines the one true URL of a page. Makes the move to a custom domain (#89) easier. |
| `lang`, Open Graph, share image | `Base.astro`, `site/public/share.png` | Good previews when a link is shared. |
| Structured data | Tracked in #37 | Not built yet. |

## The check

`npm run build` runs `site/scripts/check-pages.mjs` afterward. It fails when a built page has no title or description, a repeated title, no canonical link, no `og:image`, no `lang`, or not exactly one H1. It also checks that the sitemap, `robots.txt`, and `llms.txt` exist. CI already runs the build, so the check runs on every PR.

## Writing titles and descriptions

- Title: say what the page helps with, in plain words. The site name is added for you.
- Description: one sentence, no em dashes, no promises we cannot back up.
- Use one H1 per page and H2s for sections under it.

## Known limit

While the site lives at `david-shortman.github.io/mon-county-community-hub`, `robots.txt` and `llms.txt` sit under that folder, not at the root of the host. Crawlers look for `robots.txt` at the host root, so they will not see ours yet. The sitemap still works when submitted directly. A custom domain (#89) fixes this; when it arrives, update `site` and `base` in `astro.config.mjs`.

The share image is a plain green banner. A designed one can replace `site/public/share.png` (1200 by 630).
