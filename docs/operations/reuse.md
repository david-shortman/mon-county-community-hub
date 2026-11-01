# Reuse: the ways groups can use our data

The public page [`/use-our-data/`](https://everythingmorgantown.org/use-our-data/) (`site/src/pages/use-our-data.astro`) is the one place that lists every way to reuse the site's data, simplest first: a link, the calendar feed, printouts, the JSON API, Open Referral (HSDS), llms.txt and the MCP server, then the license and how to report a correction.

## Keeping it true

- **Only what exists.** Add a way to the page in the same PR that ships it. Counts and the license come from `catalog()` in `site/src/lib/api.mjs`, so they never drift.
- **Snippets are built from the real addresses** in the page's frontmatter (`snippets`). If an address changes, the snippet changes with it. Keep the JavaScript snippet to fields in the v1 contract (`site/src/lib/api-contract-v1.json`), so pasted code never breaks.
- **Related pages:** `/data/` (the developer view of the API), `/groups/` (each group's listings, see [group-pages.md](group-pages.md)), `/partners/` (the For groups page, which speaks for the project and waits for David), `/print/`.
