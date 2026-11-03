# Local identity guide

This guide says how the things we build can feel like they come from Morgantown and Monongalia County, without getting harder to read or use. It is the source of truth for colors, the one motif, and local wording. Every site, app, and tool we build should follow it.

**Version 3 (November 2, 2026): the Press look.** David picked "Press" from three preview looks in the identity wave (#396): a small local paper, set by hand. It changed the palette (sandstone and hemlock inks), added a serif for headings on everyday pages, ruled lines instead of soft boxes, quilt marks, and one spacing scale. The decision is in [`docs/decisions/2026-11-02-1545-press-look.md`](../decisions/2026-11-02-1545-press-look.md), and the full notes are in [`docs/design/looks/press.md`](looks/press.md). The sections changed are "Palette," "Type" and "No drawn motif."

**What changed (November 3, 2026, monthly refresh):** Rust was used as text on two pages (bus routes and how it works), below the 7:1 rule; it is now hemlock or text ink, and `check-contrast` fails the build if any style sets text `color` to `--rust` or `--brick`. The bus trip planner's menus got their own colors in dark mode. Older sections of this guide that still described the pre-Press look ("The cues we use," "Color roles," "The logo," "Applying it" and "Is it too much?") now match version 3. New research on quilting in Mon County is in [`research/2026-11-03-quilts-in-mon-county.md`](research/2026-11-03-quilts-in-mon-county.md): no local tie is confirmed yet. No resident feedback has been logged yet (#125, #242).

**Version 2 (October 29, 2026).** David chose a bolder, more distinct direction after the [Hub Identity Workshop](https://claude.ai/artifact/MR7VsryBth6f47tK2gnKmN) brainstorm. The decision is in [`docs/decisions/2026-10-29-1306-identity-v2.md`](../decisions/2026-10-29-1306-identity-v2.md). The new sections are "Personality," "Design principles," "Voice: this, not that," and "Three directions." The type and contrast rules changed.

**Rule one: readability first.** Local feel is seasoning, not the meal. Every change still has to pass all six [design rubrics](../rubrics/README.md). If a local touch ever gets in the way of reading or acting, the touch goes.

Last checked: November 3, 2026. Refreshed monthly (see "Keeping this current" below).

## What makes this place look like itself

These are the things a long-time resident, a newcomer, and a student would all recognize. Each one is sourced.

- **A river town in a ring of hills.** Morgantown grew where Deckers Creek meets the Monongahela River. The first settlement there was in 1758 ([e-WV: Monongalia County](https://www.wvencyclopedia.org/entries/1963)). The land is steep: the Deckers Creek Trail climbs about 1,000 feet in 19 miles ([Mon River Trails Conservancy](https://montrails.org/?p=177)). Wooded hills surround the town, so most views end in a green ridgeline.
- **Brick downtown.** The Downtown Morgantown Historic District (National Register, 1996) covers buildings from 1795 to 1945, in styles like Italianate, Romanesque, and Queen Anne. Many of its buildings are brick, such as the Brown Building and the Metropolitan Theatre, and a few are stone, such as the Old Stone House. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Downtown-morgantown-historic-district.pdf), [summary of the listed buildings](https://en.wikipedia.org/wiki/Downtown_Morgantown_Historic_District))
- **The Wharf District.** About 20 acres of two and three story masonry warehouses along the Mon, from about 1885 to 1948, listed on the National Register in 1998. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Morgantown-wharf-warehouse-district.pdf), [NPS record](https://npgallery.nps.gov/AssetDetail/NRIS/98001466))
- **Rail-trails on old rail lines.** Trails run along the river and up Deckers Creek on old railroad beds. The Deckers Creek Trail starts at Hazel Ruby McQuain Riverfront Park and runs about 19 miles. ([Mon River Trails Conservancy](https://montrails.org/?p=177), [TrailLink: Mon River Rail-Trail System](https://www.traillink.com/trail/mon-river-rail-trail-system/))
- **Glassmaking.** From the 1890s, more than 20 glass makers worked here. Seneca Glass (1896 to 1983) built a brick factory on the river in what is now Sunnyside. It is now the Seneca Center and is on the National Register (1985). The glass trade drew European immigrants who settled in Sunnyside. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Seneca-glass-company-building.pdf), [Clio: Seneca Center](https://www.theclio.com/entry/28417))
- **The PRT.** Small automated cars on a concrete guideway, running since 1975 between downtown, the campuses, and the medical center. ([e-WV: Personal Rapid Transit](https://wvencyclopedia.org/entries/1779))
- **Rhododendron.** The great rhododendron (*Rhododendron maximum*) grows wild in the hills and has been the state flower since 1903. ([WV State Museum: state symbols](https://wvstatemuseumed.wv.gov/site/state-symbols.html))

## Personality

Set by David on the workshop sliders, October 29, 2026. Every design and writing choice should fit this line:

**A bold, serious-leaning site that sounds casual and matter-of-fact, lightly seasonal, deeply rooted in Mon County, with the answer first and details after.**

| Spectrum | Where we sit | What it means in practice |
|---|---|---|
| Serious to playful | Serious-leaning (1 of 4) | Drawings only as quiet markers. Never jokes about hardship. |
| Formal to casual | Casual (3 of 4) | Talk like a helpful neighbor: "you," short words, contractions are fine. |
| Matter-of-fact to enthusiastic | Matter-of-fact (1 of 4) | State what to do. No exclamation points, no hype. |
| Quiet to bold | Bold (3 of 4) | Heavy display type for headings, big dates, strong blocks of color where they help action. |
| Timeless to seasonal | Lightly seasonal (2 of 4) | Type and layout never change. Any seasonal touch stays small and quiet. |
| Rooted to placeless | Deeply rooted (0 of 4) | Real local views, place names residents use, local materials in the palette. |
| Read it all to answer first | Answer first (4 of 4) | The answer or the action sits at the top of every page. Explanation comes after. |

## Design principles

Use these to settle arguments. Each one can be tested.

1. **Answer first, then explain.** The first screen of every page tells a person what to do or who to call.
2. **Two taps to help.** From the home page, a worried person reaches a phone number, a place, or a date in two taps or fewer.
3. **Point to people.** Every answer ends at a real organization: call, text, directions, or a date, with the date we checked.
4. **Bold, not loud.** Strength comes from type, size, and shape. Never from motion, noise, or more colors than needed.
5. **From here.** Local forms and words, never borrowed seals, mascots, or stereotypes.
6. **Light on any phone.** Every page works on an old Android with weak signal and with scripts off.
7. **Everyone, every time.** 7:1 text contrast, big targets, screen reader and voice control friendly, plain words.

## Voice: this, not that

- **Plain,** not childish
- **Warm,** not cheerful about hardship
- **Neutral,** not official
- **Local,** not folksy
- **Bold,** not loud
- **Fast,** not rushed
- **Confident,** never certain about someone's eligibility ("you may qualify," then the official next step)
- **Modern,** not trendy

## Three directions, used together

David chose a mix of all three workshop directions:

| Direction | Where it applies | What it means |
|---|---|---|
| **B. Front Door** | The home page | One question, "What do you need help with?", a visible search box, plain need buttons, and "Call or text 211" pinned on top. Short question flows end at real organizations. Answers live in the web address, so nothing is stored. |
| **A. Trailhead** | Every guide | Each need is a route with steps (mileposts), collapsed until needed, each step ending in an action. Based on the GOV.UK step-by-step pattern. Built as [`Route`](../../site/src/components/Route.astro) and [`Milepost`](../../site/src/components/Milepost.astro) (#240), first on `/utility-bills/`. |
| **C. Living Ridgeline** | The identity layer | Tried and removed on October 30, 2026 (#241): every drawn motif (wavy hills, per-door landmarks, a tiny skyline) read as noise. The menu border is now a plain line. Quieter ideas are being weighed instead. |

Each direction gets its own issue and PR. Until those ship, the rules below still apply as written.

**Front Door, shipped (#239), rebuilt on the doors (#250).** How the home page works, so new pages fit it:

- **Order on a phone:** the Help now bar (a place to stay tonight, 211 with a plain label, 911 and 988), the title and one line, "What do you need help with?" with the five door cards, search, the "This season" card (November to March), the next three dates, and "Rather talk to a person?" with 211. The help line sources sit in one line at the bottom.
- **Door cards** ([`DoorCards.astro`](../../site/src/components/DoorCards.astro)) come from `content/doors.yaml`. Each shows a few problems in residents' words that link straight to their page, so help is one tap from home. An example shows only once its page exists. A door with no pages yet shows its hint and leads to its section of the Topics page, which points to 211. Test: from home, two taps to a phone number, a place or a date for every live door.
- **Question flows** ([`Question.astro`](../../site/src/components/Question.astro)) use one page per answer, so the answers live in the web address, work without scripts, can be shared, and store nothing. Results say "you may qualify" and end at the official next step. The first flow is food (`/help/food/`).
- **Search** uses Pagefind, built with the site, and runs on the phone. The words go after "#" in the address, which is never sent to the host, though the host can see which search files load, as with any visit. The search box only appears when JavaScript runs, so words are never sent for a search that cannot run; without it, the home page links to All topics. Never promise more privacy than that. Pages are indexed from `<main>`; pass `searchable={false}` to `Base` to leave a page out.

**Trailhead, first route (#240).** How to turn a guide into a route, so new guides fit it:

- Wrap the steps in `<Route>` and make each one a `<Milepost n title when>`. Each step is a native `details`, so it opens and closes with no script, find-in-page opens a closed step that holds a match, and printing opens every step (with scripts off, only the open steps print).
- Open only step 1 (`open`), so the first thing to do is on the first screen. Keep a step's title a plain action ("Call your utility first").
- `when` is a short time like "Today" or "Later". Only say how long something takes when a source says so.
- End every step with an action: call, apply, text or go, using `Actions` or `.btn` links named for who you reach ("Call Mon Power"). Source lines stay under each fact inside the step.

## The cues we use

Since version 3 (Press), the local cues are flat inks taken from one place, Coopers Rock and the Cheat River, plus one plain shape. That is the whole list. Adding another needs a note in this file and a fresh "is it too much?" check.

| Cue | Where it comes from | How we use it | Why this one |
|---|---|---|---|
| **Hemlock** | The hemlock woods at Coopers Rock | The one "act" ink: links, dates, buttons, focus (`--accent`) | Green from the woods, not from a team or agency. Readable at 7:1 and more. |
| **Sandstone** | The sandstone cliffs and CCC stone walls at the Coopers Rock overlook | Paper (`--bg`) and surfaces for the Help now box, notes and season cards (`--sand`) | Warm, quiet, and local. Most people will not notice it, which is the point. |
| **Cheat water** | The green water of the Cheat River below the overlook | Step rails, step numbers and place corners (`--water`) | Ties guides to the river without drawing it. Never used for anything a person must read as a signal next to hemlock. |
| **Rust quilt marks** | Traditional quilt block geometry (see "Quilt marks") | Three plain marks only, in `--rust` | A shared folk shape drawn as structure, not a picture. No Mon County quilt tradition is confirmed yet ([research](research/2026-11-03-quilts-in-mon-county.md)), so we never call it local or a barn quilt. |

## The cues we avoid

| Cue | Why we avoid it |
|---|---|
| WVU gold and blue, the Flying WV, the Mountaineer | Belongs to the university. Would suggest we are WVU or endorsed by it. This also rules out the PRT's blue and gold cars as a color source. |
| City or county seals, logos, or official color systems | Would suggest we are the government. |
| The state flag, state seal, or "Montani Semper Liberi" | Official state symbols. Also statewide, not ours in particular. |
| Rhododendron as a decoration | It is a state symbol and shows up all over West Virginia, so it says "WV," not "Morgantown." Fine to mention in content about plants or seasons. |
| Coal, mining, and orange creek water | Deckers Creek ran orange from acid mine drainage for decades, and cleanup is ongoing ([WVDEP](https://dep.wv.gov/news/Pages/WVDEP%E2%80%99s-Richard-Mine-Treatment-Plant-Celebrates-Successful-Restoration-Efforts-in-Deckers-Creek.aspx)). Energy and mining are tied to live economic and political debates. |
| Hillbilly or "country" images, banjos, moonshine, outhouses | Stereotypes. They make fun of people here. |
| Couch fires, game day, and party culture | Tied to one group and to bad news. |
| Stock photos, or photos of people | People who are not here, or privacy risks. If we use images later, they must be our own drawings or openly licensed with credit, and never show people who can be identified. |
| Glass textures, gradients, or "stained glass" effects | The glass history is real and worth telling, but glass effects hurt contrast and look like a theme. Tell the story in words on a page instead. |

## Palette

All colors are CSS variables in [`site/src/layouts/Base.astro`](../../site/src/layouts/Base.astro). Dark mode uses dark grays, never pure black, and lighter tints of the same hues.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | Page background (sandstone paper) | `#f6f1e6` | `#171613` |
| `--card` | Card background | `#fffdf8` | `#1f1d19` |
| `--fg` | Main text, rules | `#1f1d19` | `#eeeae0` |
| `--muted` | Secondary text, fine print | `#4a453b` | `#bcb5a6` |
| `--line` | Hairlines (decorative) | `#d6cab3` | `#3a352c` |
| `--accent` | Hemlock: links, dates, buttons, focus. The one "act" ink | `#24493d` | `#93cdb6` |
| `--accent-bg` | Pale hemlock: hover, crisis line | `#e7ece4` | `#1f2a24` |
| `--sand` | Sandstone: Help now box, notes, season cards | `#ece2cd` | `#2a261e` |
| `--water` | Cheat water: step rail and step numbers | `#1c4a50` | `#8ccbd1` |
| `--rust` | Quilt marks only, never text | `#9a4b2c` | `#d98c6c` |
| `--brick` | Same as rust, kept for older rules | `#9a4b2c` | `#d98c6c` |
| `--ridge` | Same as water, kept for older rules | `#1c4a50` | `#8ccbd1` |

**Color roles stay single.** Hemlock means "you can act on this" (links, dates, focus). Rust (`--brick` is its old name) is for marks only and never carries meaning or text: it is about 6:1, under the 7:1 text rule. `npm run check-contrast` fails the build if any style sets text `color` to `--rust` or `--brick`. Where a chart needs a rust key, put a small rust swatch next to text-colored words.

### Measured contrast (WCAG AAA for text)

Run `npm run check-contrast` in `site/`. It reads the tokens straight from `Base.astro` and fails the build if any required pair drops below the minimum. It also runs after every `npm run build`.

**Text needs 7:1** (WCAG 2.2 AAA, criterion 1.4.6), our rule since October 29, 2026. Only about 31% of phone sites pass even the lower AA bar. Non-text parts that help people see an edge need 3:1. Decorative lines have no minimum and are kept faint on purpose.

| Pair | Kind | Light | Dark |
|---|---|---|---|
| `--fg` on `--bg` | text | 14.94:1 pass | 15.06:1 pass |
| `--fg` on `--card` | text | 16.55:1 pass | 14.01:1 pass |
| `--fg` on `--accent-bg` | text | 14.03:1 pass | 12.35:1 pass |
| `--muted` on `--bg` | text | 8.45:1 pass | 8.87:1 pass |
| `--muted` on `--card` | text | 9.37:1 pass | 8.25:1 pass |
| `--muted` on `--accent-bg` | text | 7.94:1 pass | 7.28:1 pass |
| `--accent` on `--bg` | text | 8.90:1 pass | 10.04:1 pass |
| `--accent` on `--card` | text | 9.86:1 pass | 9.33:1 pass |
| `--accent` on `--accent-bg` | text | 8.36:1 pass | 8.23:1 pass |
| `--card` on `--accent` | text | 9.86:1 pass | 9.33:1 pass |
| `--fg` on `--sand` | text | 13.08:1 pass | 12.54:1 pass |
| `--muted` on `--sand` | text | 7.40:1 pass | 7.39:1 pass |
| `--accent` on `--sand` | text | 7.79:1 pass | 8.35:1 pass |
| `--card` on `--water` | text | 9.63:1 pass | 9.28:1 pass |
| `--rust` on `--bg` | non-text | 5.46:1 pass | 6.82:1 pass |
| `--rust` on `--card` | non-text | 6.05:1 pass | 6.34:1 pass |
| `--brick` on `--bg` | non-text | 5.46:1 pass | 6.82:1 pass |
| `--brick` on `--accent-bg` | non-text | 5.13:1 pass | 5.60:1 pass |
| `--ridge` on `--bg` | decorative | 8.69:1 | 9.98:1 |
| `--line` on `--bg` | decorative | 1.44:1 | 1.49:1 |
| `--line` on `--card` | decorative | 1.59:1 | 1.38:1 |

## Type

- **Headings on everyday pages (Press, #396):** Newsreader, weight 600 (Production Type, SIL Open Font License, [`site/public/fonts/OFL-Newsreader.txt`](../../site/public/fonts/OFL-Newsreader.txt)), one static cut at optical size 48, Latin only, 14.3 KB, `font-display: optional`. It sets `h1` to `h3`, card titles, door names and big dates.
- **Headings on urgent pages, and labels everywhere:** Atkinson Hyperlegible Next, weight 800. Urgent pages are the home page, Help now, food help, utility bills, after a storm and every page with the crisis strip (the list is in [`site/src/lib/urgent-pages.mjs`](../../site/src/lib/urgent-pages.mjs)). They never load the serif, so they stay under the 50 KB budget. Atkinson also sets kickers, the dateline and buttons.
- **About Atkinson:** It was made by the Braille Institute so letters that look alike (l, I, 1, O, 0) are easy to tell apart. It is free under the SIL Open Font License ([`site/public/fonts/OFL.txt`](../../site/public/fonts/OFL.txt)).
- **How it loads:** self-hosted, never from a font service, so no third party sees our visitors. One weight, Latin characters only, about 11 KB. It uses `font-display: optional`: if it is not ready in a moment, the page uses the system font for that visit and never waits or jumps. Next visit it comes from the cache.
- **Body text:** the system font stack. Research finds no single font is fastest for everyone, and serif versus sans does not change legibility, so body text stays on what each phone does best, at no cost.
- **Site name (the logo):** Fraunces, soft (weight 800, softness 100, no wonky letters, optical size 48), for the name in the header and the link preview only. See "The logo" below.
- **Sizes:** five. 15.2px for sources and fine print, 18px body, about 21px for h3 and the home intro, 28px for h2, 34 to 48px for h1.
- **Spacing:** one scale of 4, 8, 12, 16, 24, 32, 48 and 64px (`--s1` to `--s8` in [`site/src/styles/press.css`](../../site/src/styles/press.css)). The same relationship always gets the same gap, and there is more room above a heading than below it.
- **Don't** add more weights or families without updating this section and checking page weight. Don't use Public Sans: it reads as a federal government site.

## The icon

David picked the icon on October 30, 2026 (#390, #389): Westover and Morgantown on two sage hills facing each other across the Monongahela River, joined by an open arch bridge, with ridges behind. Two towns, one river, joined: it says "connect, don't compete" without naming or favoring any institution.

- **Files:** [`site/public/favicon.svg`](../../site/public/favicon.svg) (rounded corners) and [`site/public/icons/icon-full.svg`](../../site/public/icons/icon-full.svg) (square, for home screens that round icons themselves). The PNG icons are made from these. The plain link preview image, [`site/public/share.png`](../../site/public/share.png), shows the icon beside the site name; redraw it with `node scripts/make-share-image.mjs` in `site/`. Guides get their own preview picture, see "Share cards" below.
- **Colors:** existing tokens only: hill green (`#1f5c4a`, `#2f7a63`), `--accent-bg` for the pale houses and bridge, sage for the hills, and the dark mode accent for the river.
- **Rules David set during review:**
  - Pale houses on sage hills, so they do not blend.
  - A few uneven houses on flat hilltops. Evenly spaced roofs looked like gear teeth from far away.
  - Rounded roofs and corners.
  - The bridge sits behind the hills.
  - The waterline is flat.
- **Where:** the browser tab, the home screen, link previews and the logo in the header. It is not a drawing to repeat on pages (see "No drawn motif").

## The logo

David picked it on October 30, 2026 ([decision](../decisions/2026-10-30-1500-header-logo.md), #421): the icon as a small rounded tile, then the name "Everything Morgantown" on one line in Fraunces, soft. He chose the tile over a one-color line drawing and a name-only version, and Fraunces over Nunito and Bitter, because it adds warmth and a nod to the old downtown while staying bold and easy to read.

- **Where:** the site header (`site/src/layouts/Base.astro`), the plain link preview image (`site/public/share.png`, made by `scripts/make-share-image.mjs`) and the top of every share card (see below). Headings follow "Type" (Newsreader on everyday pages, Atkinson on urgent pages); nothing else uses Fraunces.
- **Tile:** the same drawing as `public/favicon.svg`, read in at build time, so the two never drift. 40px on wide screens, 34px on phones, with a thin `--line` ring in dark mode so the green edge does not sink into the page.
- **Name:** real text, so screen readers read it and it grows with the reader's text size. The tile is hidden from screen readers. Text color is `--fg`, the same 7:1 pair as body text.
- **How the font loads:** `site/src/fonts/fraunces-name-800.woff2` holds only the letters in "Everything Morgantown" (E, M, a, e, g, h, i, n, o, r, t, v, w, y and a space), about 2.5 KB. It is built into each page's CSS, so the name never waits for a download and never changes font as it loads (`font-display: block` is safe here because there is nothing to wait for). It adds about 3.5 KB gzipped to each page, tile included. License: SIL Open Font License, in `site/src/fonts/OFL-Fraunces.txt`.
- **If the name changes:** cut a new file, or new letters will show in Georgia. Made with fontTools from Fraunces in the Google Fonts repo: instance `wght=800, SOFT=100, WONK=0, opsz=48`, then `pyftsubset` with `--text="Everything Morgantown" --flavor=woff2 --layout-features=kern,liga --no-hinting`.
- **Don't** use Fraunces for headings or body text, stretch or recolor the tile, or put the name in hill green (green means "you can act on this").

## Share cards

David asked on November 2, 2026 for link previews that change from page to page: the image at least by category, the logo kept, and above all the title and text varied ([decision](../decisions/2026-11-02-1500-share-cards.md)). So every guide has its own 1200 by 630 preview picture, at `/share/<page>.png`, which is also what its Share this box downloads.

- **What it shows:** the logo (icon tile and name in Fraunces) at the top; the page's door (Get care, Living here and so on) with that door's menu icon; the page's label in Atkinson Hyperlegible Next 800; its one-line summary; and its short address. Hill green ground, `--bg` white for the name and title, `--accent-bg` for the summary, the dark mode accent for the door and address. A door's own page leaves out the door line, since its title is the door's name.
- **Made at build time** by [`site/src/lib/share-cards.mjs`](../../site/src/lib/share-cards.mjs) and [`site/src/pages/share/[...card].js`](../../site/src/pages/share/[...card].js), from the same page tags as door lists and breadcrumbs, so a new page gets its card with no extra step. Free: satori (MPL-2.0) lays it out and resvg (`@resvg/resvg-js`, MPL-2.0) draws the PNG, inside the build. About 50 to 70 KB each. A preview picture is never loaded by the page itself, so it does not count toward page weight.
- **Fonts:** TrueType copies in `site/src/fonts/` (the drawing tools cannot read woff2): `atkinson-hyperlegible-next-800.ttf` (the same Latin cut as the web font), `atkinson-hyperlegible-next-500.ttf` (weight 500 for the summary, same letters, cut from the Google Fonts variable font with fontTools) and `fraunces-name-800.ttf` (the logo letters only). SIL Open Font License, see `site/public/fonts/OFL.txt` and `site/src/fonts/OFL-Fraunces.txt`. If a label uses a letter outside Latin, add it to the cut.
- **Which pages:** every tagged page with a label. Crisis pages (the ones with the crisis strip) and pages whose address or label is about domestic or sexual violence keep the plain `share.png` and get no card file at all, so a link to one never shows its name in big type in a group chat. Pages with no tags (home, Topics, search, and pages built from lists, like each town or group) also keep the plain picture. Guides in the Help now, Get through this month and About doors, and on housing, money or food, do get cards even though their Share this box waits for David: he chose that on November 2, 2026, since a pasted link already shows the same title and summary as text. A new safety page (stalking, for example) gets the plain picture by using the `crisis` layout option, not by its wording.
- **Checks:** `npm run check-pages` fails if a page's `og:image` is not a file in `dist/`, has no alt text, or if a crisis page has a card file. `test/share-cards.test.mjs` checks the paths, the quiet and crisis pages and the picture size.
- **Don't** add photos, drawn motifs or a different color per door (see "Quilt marks"); the door's name and icon are what change.

## Quilt marks (was: No drawn motif)

**Since November 2, 2026 (Press):** the site uses quilt geometry, drawn plainly, in three places only: a small half-square triangle in the top left corner of each card and home door (rust, hemlock or Cheat water, pure CSS), a Flying Geese triangle before each choice on door pages, and one Log Cabin block above the title of the 404 page. They are never called barn quilts, never round, and never on the crisis strip, Quick exit or tab bar. David saw them in the Press preview and picked it (#396).

**Before that:** the site had no drawn motif. On October 30, 2026 we tried three (a wavy ridge of hills under the menu, a named landmark drawing for each door, and a tiny skyline of local shapes on the menu line). David found each one distracting, so all three were removed ([decision](../decisions/2026-10-30-1000-no-drawn-motif.md)). The menu border is a plain 1px `--line` rule, under the header on wide screens and on top of the tab bar on phones.

Before adding any drawn shape again, show David screenshots first and run the "Is it too much?" check below.

## Quiet local touches

Ways to root the site in Mon County through useful words and facts instead of decoration. David picked these on October 30, 2026.

- **Dateline** (shipped): under the site name, "Morgantown · Friday, October 30 · High 66°, mostly sunny", with one small weather symbol, in `--muted` text. Phones use the short date ("Fri, Oct 30"). The forecast comes from the National Weather Service (api.weather.gov, public domain, free) at build time, so visitors' browsers never contact a weather service. The site rebuilds every morning and on every merge; the page script keeps the date current and hides a forecast from an earlier day. If the service is down, the dateline shows the date only. The forecast links to the NWS page as its source. Code: [`site/src/lib/weather.mjs`](../../site/src/lib/weather.mjs).
- **Town names on places** (next): each place card names its town or neighborhood and a landmark people use for directions.
- **Town filter on Dates** (next): choose a town to see only its dates.

## Voice notes

Use the names residents use, when it makes directions clearer. Always give the full or official name once on a page, then the short name.

- **"Mon County"** is how people here say Monongalia County. Use "Monongalia County" once, then "Mon County."
- **"The Mon"** is the Monongahela River (as in the Mon River Trail). Write "the Monongahela River" first.
- **Neighborhoods and towns:** Sunnyside, Wiles Hill, South Park, Evansdale, Suncrest, the Wharf District, downtown. Westover, Star City, Granville, Cheat Lake, and Blacksville are their own places; don't fold them into "Morgantown."
- **Landmarks for directions:** "the rail-trail," "Hazel Ruby McQuain Riverfront Park," "the Seneca Center on Beechurst Avenue," "the PRT." Landmarks help people find a place, but always give a street address too.
- **Deadlines (#51):** say plainly that the last day counts, with the weekday: "The last day is Tuesday, December 15." Not "by December 15" or "on or before," which people read differently. Give a time only when the source sets one ("until 7 p.m. on Saturday, November 7"). Times read "8 a.m.", "8:30 a.m.", "noon".
- **Time of day (#1378):** no "tonight", "this morning" or "right now" unless the time is the point (a place to stay tonight, a crisis right now, a calendar date). A reader may arrive at any hour. For a source, say "when we checked", not "today". Details and the build check: "Rules for every entry" in `content/README.md`.
- **Don't** use slang, dialect spelling, or sports chants. Plain, warm, and neutral.

## Mobile first

Nearly everyone reaches the site on a phone. Design for a 390px screen first, then let it grow. These rules come from the first mobile pass (#126).

- **Act first.** Every card leads with when it is (a big date and "in 3 days"), then what it is, then big buttons to act: Details, Call, Directions, Add to calendar, Share. Use the [`Actions`](../../site/src/components/Actions.astro) component. Each button shows only when we have a sourced link, phone, or place.
- **Thumb reach.** The main menu is a tab bar at the bottom of the screen on phones, with icons and words, at least 48px tall, and the current page marked by bold text and a tinted pill (not color alone). It has four tabs: Home, Help now, Dates and Topics. The Topics tab is marked on any page inside a door. On wide screens the header shows Help now, the five doors, Dates and All topics. The footer lists the doors, All topics, About and For groups and helpers. All of it comes from `content/doors.yaml` (#250), so a new page never changes the menu: tag it with its door and topic (see `content/README.md`, "Tagging a site page") and it shows on the Topics page and its door.
- **Compact buttons (#335).** In a row of actions, secondary buttons are sized to their label and wrap as a group. Only the main action (`.btn-primary`, like Call or More details, and a Call button in a `.btn-wide` slot) spans the full width. The Help now pair on the home page keeps two equal columns.
- **Big targets.** Buttons and tabs are at least 48px tall. Nothing a person needs to tap is smaller than 44px.
- **Crisis pages.** A page a person in danger may read passes `crisis` to `Base`, which adds the crisis strip and the Quick exit button (compact since #420, with a small "What is this?" link to the page's note) ([`CrisisStrip.astro`](../../site/src/components/CrisisStrip.astro), #174) and sends no referrer. The strip uses `--accent-bg` with a brick edge, and the button is `--fg` on `--bg`, so no new colors. It shows only on those pages, never across the site.
- **Name things in context.** Screen readers hear which event a button is for ("Add to calendar: Free tire drop-off, November 14, 2026"), so no two links on a page sound the same.
- **Local and plain.** Directions buttons use the place the source published. The card text around them uses names residents know (see the voice notes).
- **Modern CSS (#153).** Headings use `text-wrap: balance` and text uses `pretty`, so lines break evenly. The `h1` eases from 1.9rem down to 1.7rem on the smallest phones. The browser bar matches the page through `theme-color` meta tags; if `--bg` changes, change them too.
- **Light pages.** CSS is inlined so a page paints in one request. The only script is small and optional; the page works without it.
- **Check it.** Before shipping, test at 320px and 390px: no sideways scrolling, nothing hidden under the tab bar when you Tab through the page, and axe clean in light and dark.

## Applying it to new pages and apps

1. Use the `Base` layout, or copy its `:root` tokens exactly. Don't invent new colors. If you truly need one, add it here with its contrast ratio first.
2. Use the `Base` layout's header and tab bar. Don't add drawn shapes beyond the three quilt marks.
3. Use `--rust` (or `--brick`) only for quilt marks, thin edges and chart swatches, never for text.
4. Keep the layout, sizes, and type scale from the rubrics. Local identity never changes where things are.
5. Use local place names from the voice notes when they make an answer clearer.
6. Run `npm run build` (which runs the contrast check) and the rubric checks in light and dark mode at 390px and 1280px.

### Is it too much? A quick check

Answer each one by looking at a 390px screenshot. Any "yes" means pull back.

- Do you notice the local touch before you notice the page title?
- Is there drawn decoration beyond the quilt marks, or more than a few quilt corners on one screen?
- Would someone think this site belongs to the city, the county, WVU, or a business?
- Does any local touch carry meaning (status, warning, "click here")?
- Would a long-time resident, a newcomer, and a student each feel it is not about them?
- Did it make anything harder to read, slower to load, or harder to use with a keyboard or screen reader?

## Keeping this current

A monthly refresh re-checks this guide: new sources, new pages, and whether the cues still feel right. Each refresh adds a short build log entry and updates the "Last checked" date at the top. Feedback from residents and local groups (asked only by David, never by agents) outranks our own judgment.

Screenshots of the first version, before and after: [`screenshots/`](screenshots/).
