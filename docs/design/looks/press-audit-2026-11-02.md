# Press audit: the page types the first pass did not tune

November 2, 2026. Sprint wave 10, Press follow-through lane (#529, #396).

The Press lane tuned the main page types: home, doors, help pages, cards, Dates, Trailhead routes, the 404 and the phone header ([press.md](press.md)). This audit covers every other page type. One page per template was built from `main` and checked at 390px and 1280px, in light and dark, plus print (light and dark) and 320px at 200% text.

**How it was checked.** Screenshots of 40 pages, a computed-style scan of every element (colors that are not one of the ten Press inks, corners rounder than 3px, shadows, headings not in the serif or heading face), and a 320px reflow test at 200% text. Pages: `/property-tax/`, `/bus-routes/`, `/how-we-are-doing/`, `/pulse/`, `/data/`, `/thrift-shops/` (area picker), `/search/` (with results and with none), `/topics/`, `/towns/`, `/towns/cassville/`, `/community-centers/`, a center page and its flyer, `/community-centers/halls/`, `/print/`, `/print/care/`, `/print/cards/`, `/embed/`, three embeds, `/hard-questions/`, `/about/`, `/how-we-check/`, `/privacy/`, `/corrections/`, `/file-today/`, `/make-a-list/`, `/find-your-people/`, `/groups/` and a group page, `/meetings/`, `/meetings/agendas/`, `/make-it-better/report/`, `/for/helpers/`, a life event page, `/use-our-data/`, `/who-decides/`, `/es/`, `/partners/`.

**What is already fine.** No page scrolls sideways at 320px with 200% text. Every heading is in Newsreader or the heading face. Every text and surface color is one of the Press inks, apart from the ones listed below. Long text guides, towns, groups, life events and the meetings pages read well and need nothing.

## Issues and fixes

| # | Page type | Issue | Fix |
|---|---|---|---|
| 1 | **Print, every page** | A phone or computer in dark mode prints with the dark inks. Print sets the page to white and black, but cards and notes keep their dark fill, so their text is black on near black, and the lede, links and source lines are pale tints on white paper. Hard to read on any page, including the community center pages people print. | In print, set every ink to its light value, with white paper and card. Shared, in `press.css`. |
| 2 | Print, every page | Buttons that only work on a screen ("Copy link", "Print this", "Share") print as empty boxes. | Hide `button` elements in print. Links styled as buttons stay, since they carry the words. |
| 3 | Share this box (most guides), Print and Share buttons (groups, file today, reports) | 8px soft corners, the old look. | 2px corners. The Share this box becomes a slip like a card, with the 2px top rule. |
| 4 | Forms: `/file-today/` call notes, `/make-a-list/`, the area picker, the community center search | Text boxes and menus at 6 to 10px corners; the call notes panel is a 10px dashed box. | 2px corners on every field and panel. Shared. |
| 5 | `/topics/` Ways to explore | Rounded pills (22px). Press has no round marks. | Square tags (2px). |
| 6 | `/hard-questions/`, `/how-we-check/` "Not yet" boxes | Pale hemlock with a left bar and soft corners, unlike every other note. | Press note: sandstone, 2px top rule. |
| 7 | `/how-we-are-doing/` tiles, `/use-our-data/` and `/embed/` code boxes, What happens next boxes | 4 to 8px corners, soft boxes. | 2px corners; tiles get the card's top rule. |
| 8 | Tables (`/community-centers/halls/`, `/how-we-are-doing/`, `/after-you-apply/`) | The table box has no column head rule, and the header row reads as a tinted band. | A 2px rule under the header row, like a printed table, and even (tabular) figures. |
| 9 | `/search/` results | The "10 pages match" line touches the search box. | 12px gap (`--s3`). |
| 10 | Embeds (help now, a listing, dates) | Still the old look: 8px cards and pill buttons. The embed page carries its own copy of the tokens and no fonts. | Same shape rules as the site: 2px corners, a 2px top rule on cards, 3px buttons. No fonts added, so embeds stay small and script-free. The help now embed names crisis lines, so that PR is `for:david`. |
| 11 | `/bus-routes/` (A day on the buses) and Follow one listing | Rust used as text for times and labels (5.5:1). Press says rust is for marks only, and our text rule is 7:1. The time slider uses the browser's own grey field in dark mode. | Not fixed here: these are the explainer lanes' components (#1440, #1441). Noted on #1441. |
| 12 | `/print/` sheets | Item titles are in the body face, so the sheet does not look like the rest of the site. | Left as is: on paper at 10.5pt the bold body face reads better than a serif, and the printouts lane owns #405. |
| 13 | Saved copy note (offline) | Pale hemlock with a hemlock rule; fine in both modes. | No change. It sits above the crisis strip's neighbors on Help now, so a change there would be `for:david`. |
| 14 | `/print/cards/` | Fixed white and black colors. | No change: these are wallet cards meant for paper. |
| 15 | Share cards (#1417), the link preview picture for each guide | Still the old look: the old hill green ground and the heading face, not hemlock and Newsreader. | Hemlock ground, paper and pale hemlock text, Newsreader for the title, one rust quilt corner. Same size and layout. |

## Status

| PR | Rows | State |
|---|---|---|
| #1469 | 1, 2 | Waits for David (changes how Help now pages print) |
| #1490 | 3 to 9, for pages that do not name a crisis line | Merged |
| #1492 | 3, 4, 6, 7 for shared components and pages that name a crisis line | Waits for David |
| #1495 | 15 | Merged |
| #1497 | 10 | Waits for David (Help now embed) |
| #1441 comment | 11 | For the explainer lane |
