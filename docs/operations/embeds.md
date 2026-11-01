# Embeds: keeping the widgets working

Embeds are small pages that libraries, offices and local groups put on their own websites in an iframe. They show the same records as the site, with each item's source and checked date, and link back. The public page that explains them is [`/embed/`](https://everythingmorgantown.org/embed/).

## What exists

| Widget | Address | Built by |
|---|---|---|
| Upcoming dates, all of Mon County | `/embed/dates/` | `site/src/pages/embed/dates/[...filter].astro` |
| Upcoming dates, one topic | `/embed/dates/topic/<topic>/` | same file; topics come from `content/doors.yaml` |
| Upcoming dates, one town | `/embed/dates/town/<town>/` | same file; towns come from `site/src/lib/towns.mjs` |
| One listing as a card | `/embed/listing/<slug>/` | `site/src/pages/embed/listing/[slug].astro`; one per record in `content/resources`, hidden ones too |
| Help now box (911, 988, 211) | `/embed/help-now/` | `site/src/pages/embed/help-now.astro`; facts from `content/resources/wv-211.yaml` and `988-lifeline.yaml`. High stakes: a change waits for David |

Shared code: [`site/src/lib/embeds.mjs`](../../site/src/lib/embeds.mjs) (filters, limits, the iframe code) and [`site/src/layouts/Embed.astro`](../../site/src/layouts/Embed.astro) (the frame every widget uses).

## Rules every widget follows

1. **No scripts, cookies, outside fonts, or outside images.** A widget is plain HTML and inline CSS. `test/embeds.test.mjs` fails if the frame, or any built widget page, has a `<script>`. Never add analytics or a third-party script to an embed, even a "privacy-friendly" one.
2. **Every item shows its source and checked date**, and links back to the site.
3. **Links open in a new tab** (`<base target="_blank">`), so a reader never gets stuck in a frame.
4. **Kept out of search.** Each widget is `noindex` and left out of the sitemap (`astro.config.mjs`), so search sends people to the real pages. The gallery page `/embed/` is indexed.
5. **Addresses never break.** A group's pasted code points at an address. Keep every widget address working, even when it has nothing to show (it says so instead). A topic or town widget exists for every topic in `content/doors.yaml` and every town in `towns.mjs`, with or without dates.
6. **The 911 and 988 line.** Every widget footer has the same "In an emergency, call 911. In a crisis, call or text 988." line as every page on the site (`e2e/crisis.test.mjs` checks it). Because the frame names crisis lines, any change to `Embed.astro` or the help now box waits for David.
7. **Same colors as the site.** The frame copies the color tokens from `Base.astro`. `test/embeds.test.mjs` fails if they drift, so change both together.

## Common jobs

- **Add a topic or town:** add it to `content/doors.yaml` or `site/src/lib/towns.mjs`. The widget and its line on `/embed/` appear on the next build.
- **Remove or rename a topic or town:** don't remove the widget address. Groups may have pasted it. Keep the old address building (for example, map the old slug to the new topic in `embedTopics()`) and note it here.
- **Change how many dates show:** `EMBED_DAYS` and `EMBED_MAX` in `embeds.mjs`. The gallery text reads them, so it stays right.
- **Add a widget:** put it under `site/src/pages/embed/`, use `Embed.astro`, add a row to the table above and a section to `/embed/`. If it makes many pages from one template, add the family to `FAMILIES` in `site/scripts/check-a11y.mjs` so the scan samples it instead of opening every page.
- **A listing is hidden:** its card keeps its address and shows the re-checking note, with no facts. Never delete a card address.
- **A widget shows something wrong:** fix the record in `content/`. Every widget picks it up on the next build. To take a record down fast, use `hidden` (see `content/README.md`); widgets skip hidden records.

## Checks

- `npm test` runs `test/embeds.test.mjs`: colors match, no scripts, filters and the cap work.
- `npm run build` runs the page checks (title, description, one heading) on every widget.
- The accessibility scan (`npm run check-a11y`) opens `/embed/dates/` and a sample of the topic and town widgets in light and dark, and at 320px.
