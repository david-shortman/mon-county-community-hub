# Ledger: a preview look

Phase 2 of the visual identity wave (#396). Preview it on any page by adding `?look=ledger` to the address, for example [everythingmorgantown.org/?look=ledger](https://everythingmorgantown.org/?look=ledger). `?look=off` goes back to normal. Residents who never use the link load nothing extra.

Files: [`site/public/looks/ledger.css`](../../../site/public/looks/ledger.css) and the fonts in [`site/public/looks/ledger/`](../../../site/public/looks/ledger/). One markup hook was added for it: `<span class="checked">` around the "Checked <date>." phrase in `SourceLine` and `EventCard` (#1395). It has no styles in the normal look.

## The idea

A well-kept town ledger, a bus timetable and an old downtown storefront sign. It is built around the one thing no peer site does: every fact shows the day we checked it, so that date becomes the signature of the page.

## Signature moves

1. **The checked stamp.** "Checked October 31, 2026." is set as a typed stamp: Atkinson Hyperlegible Mono, capitals, a 2px brick box, a drawn check mark, tilted 1.2 degrees like a hand stamp. It sits on its own line between the sources and the "check with them first" note. The words are the same, so screen readers hear the full date.
2. **Sign-painted section heads.** `h2` section heads in League Gothic capitals on a 4px ink rule, like a painted downtown sign board. Page titles (`h1`), card titles and door names stay in Atkinson Hyperlegible Next 800, the reading face.
3. **Dates as a printed listing.** Event dates in League Gothic at 2.3rem in brick, with "TOMORROW" or "OPEN NOW" under them in the stamp face. On screens 48em and wider the date gets its own column beside the entry, like a timetable. "This week" on Dates is a timetable of rows with the day in a fixed column. Week headings are sign-painted too.
4. **Survey ticks under the header.** A chained line with a tick every 24px, a taller tick every 120px, and a square "stone" at each end, from the Mason-Dixon survey line that runs along the county's north edge. Pure CSS gradients, 0 bytes of image. The dateline above it is set in the stamp face.
5. **Ruled entries, not boxes.** Resource and event cards lose their rounded white box and become ledger entries: a 2px ink rule on top, a dashed rule above the sources. Home page doors become a ruled two-column index with bare brick icons. Everything inside the page is square; buttons keep a 3px corner.
6. **Mile markers on routes.** Trailhead step numbers are square ink posts with League Gothic numerals, on a chained survey line instead of the soft rail.
7. **A colophon footer.** A double ink rule opens the footer. The "independent guide" note is set in the stamp face between dashed rules, and a short colophon line names the typefaces and says every entry shows its source and checked date.
8. **A ledger margin** on wide screens: a thin double brick line down the left of the page, like the ruled margin of a ledger book.

## Palette: Wharf brick and river slate

From the sense of place research (palette 3). Slate is the one action color (links, buttons). Brick holds the stamp, big dates and edges. Ratios are WCAG contrast on the page, card and tint backgrounds, measured with the same formula as `npm run check-contrast`.

| Role | Light | Dark | Lowest text contrast (page, card, tint), light / dark |
|---|---|---|---|
| Page (`--bg`) | `#f8f6f1` | `#161615` | |
| Card | `#ffffff` | `#1e1e1c` | |
| Tint (`--accent-bg`) | `#efe6dc` | `#2b221e` | |
| Ink (`--fg`) | `#1e1d1b` | `#ecebe7` | 13.65 / 13.04 |
| Muted | `#4a4742` | `#b8b4ad` | 7.50 / 7.53 |
| River slate (`--accent`, links and buttons) | `#264a5c` | `#93bdd3` | 7.68 / 7.75 |
| Brick (stamp, dates, edges) | `#7a3322` | `#e59d86` | 7.32 / 7.03 |
| Button text on slate | | | 9.47 / 8.32 |
| Rule (ticks, dashed lines; non-text) | `#8a8176` | `#6f685f` | 3.55 / 3.30 on the page |
| Line (decorative) | `#d9cfc1` | `#3a3732` | decorative |

Every text pair is at least 7:1 in both modes. No gold or yellow.

## Type

| Use | Face | Size |
|---|---|---|
| Body | System font (unchanged) | 1.125rem |
| Page title `h1` | Atkinson Hyperlegible Next 800 | 2rem to 2.75rem (home question up to 3rem) |
| Section head `h2` | League Gothic, capitals | 2.1rem |
| Card title `h3`, door names | Atkinson Hyperlegible Next 800 | 1.25rem to 1.3rem |
| Big dates | League Gothic, capitals | 2.3rem |
| Stamp, dateline, labels, colophon | Atkinson Hyperlegible Mono 600 | 0.875rem (14px) |
| Sources and fine print | System font | 0.95rem |

Fonts added, both SIL Open Font License, licenses next to the files:

- League Gothic (wdth 100 instance), capitals, digits, punctuation and Latin-1 capitals only: **4.7 KB** woff2.
- Atkinson Hyperlegible Mono (wght 600 instance), basic Latin: **5.3 KB** woff2.
- Stylesheet: 16 KB, **4.3 KB** gzipped.

So the look adds about 14 KB to a page. Both fonts use `font-display: fallback` (a short wait, then the system font for that visit). `optional` was tried first, but on a cold first visit it showed the fallback on the first page, which would hide the look on a first tap. **Crisis pages (any page with the crisis strip) never use either font**: section heads and dates fall back to Atkinson, so nothing new downloads there. The crisis strip, Quick exit, Help now bar and tab bar keep their layout; they only pick up the new colors and square corners.

Made with fontTools: `fonttools varLib.instancer` then `pyftsubset --flavor=woff2 --layout-features=kern,case` (League Gothic) or `kern,zero` (Mono) `--no-hinting --desubroutinize`, from the files in the [google/fonts](https://github.com/google/fonts) repo.

## Checked

Built site with `?look=ledger`, on home, `/money/`, `/stay-tonight/`, `/legal-help/`, `/calendar/`, `/start-a-business/` and the 404:

- axe (WCAG 2.2 A and AA rules) at 390px and 1280px, light and dark: 0 problems on all 28 runs.
- 320px wide with text at 200%: no sideways scroll on any of the seven pages. League Gothic heads wrap to two or three short lines and stay readable; the timetable rows drop to one column below 22em.
- No motion is added, so reduced motion needs nothing.

## Left out, and why

- **Big serif second voice** (Broadsheet): another lane's direction, and 20 KB.
- **Ruled-paper lines behind text:** they lower contrast behind body text.
- **A black header band** (Field guide): another lane's direction, and it reads more official.
- **League Gothic for door names and card titles:** condensed capitals are harder to read in phrases people scan when stressed. It stays on short heads and dates.
- **Entry numbers on cards ("No. 03"):** fun, but one effect too many.
- **Short stamp dates ("OCT 31"):** CSS cannot shorten the text, and the full date reads better aloud.
- **Moving the checked date to the top of the card:** would need reordering markup, which this wave does not do.
- **Drawn ridge or contour lines:** the October 30 decision against drawn motifs still stands. The survey ticks are rules, not a drawing.

## Known issues

- **Feed events have no stamp.** Events pulled from a feed say "Pulled from the ... calendar on <date>", not "Checked", so they show no stamp. That is honest, but a reader may wonder why some entries have one.
- **Hand-written "Checked" lines** inside some guide pages (for example route steps) are not wrapped yet, so they show as plain text. Only `SourceLine` and `EventCard` carry the hook.
- **League Gothic digits are not tabular** (the font has no `tnum`). Dates sit in a column so it barely shows.
- **The stamp tilt** is a small effect; drop the `transform` if it reads as playful.
- **Desktop nav** still wraps to two rows at 1280px, as it does today.
- **Forced colors (Windows high contrast)** not tested on a real device; the check mark uses `CanvasText` there.

## Screenshots

To follow (390px wide, light and dark).
