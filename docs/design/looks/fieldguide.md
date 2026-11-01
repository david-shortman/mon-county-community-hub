# Preview look: Field guide

Phase 2 of the visual identity wave (#396). One of three looks David can tap through. Preview it on any page by adding `?look=fieldguide` to the address (for example [everythingmorgantown.org/?look=fieldguide](https://everythingmorgantown.org/?look=fieldguide)). `?look=off` goes back to normal. Residents who never use the link load nothing from this look.

Built November 1, 2026, by Claude Code. Files: [`site/public/looks/fieldguide.css`](../../../site/public/looks/fieldguide.css) and [`site/public/looks/fieldguide/`](../../../site/public/looks/fieldguide/).

## The idea

The site as a park map or a naturalist's field guide, made by people who measured the place. It gets its character from structure (a solid band, heavy rules, square corners, side heads in a margin) and from the real shape of the land, not from decoration or a new font.

It merges three phase 1 ideas: "Field guide" from the [generic tells](../research/2026-11-01-generic-tells-and-peers.md) audit, "Measured land" from [sense of place](../research/2026-11-01-sense-of-place.md), and the structure twists of "Almanac" from [modern craft](../research/2026-11-01-modern-craft.md).

## Signature moves

1. **A solid ink band for the name.** The logo and dateline sit on a dark band, in the spirit of the National Park Service brochure band but with no seal, no "official" words, and our own wordmark. The dateline is set as a map title block: small capitals, spaced. On wide screens the menu sits on paper under the band, as plain bold words (no underline), with a 5px bar under the current page and a 3px rule closing the header.
2. **Rules, not rounded boxes.** Every corner is square. Cards lose their box and get a 2px ink rule on top. Callouts are a woods tint under a 4px rule, like a legend box. Only the Help now bar on the home page is a framed panel, so "framed" means "urgent."
3. **Side heads in a margin column (64rem and up).** Section headings hang in a 13rem column to the left of the 46rem text column, on the same rule as the first thing in the section. Breadcrumbs move into that column too. Below 64rem (and at 200% text, since the breakpoint is in rem) the page is a single column as today.
4. **Contour line rules.** On wide screens, a strip of three real contour lines runs above each section in the text column. They are traced from USGS elevation data for a hillside southeast of Morgantown (about 39.61° N, 79.92° W to 79.88° W, every 120 ft).
5. **The measured ridge.** Every page ends on a dark band whose top edge is the real ground profile across the valley at latitude 39.630° N, from west of Westover over the Monongahela to the hills east of town (USGS 3DEP, 600 samples, lightly smoothed). The footer says what it is and credits the U.S. Geological Survey.
6. **A labeled profile on the 404.** The same profile as a thin line, with the river labeled in italic at its true spot (45.9% across), the way USGS maps letter water.
7. **Routes as a trail.** Trailhead routes and door page steps get a dashed trail line in contour brown with square numbered blazes instead of round dots.

## Palette: Topo sheet

From the color grammar of USGS topographic maps. Water blue is the one action color (links, dates, focus, the main button). Contour brown is for rules, the trail and motifs only, never for text people must read (it would pass, but it would compete with blue).

| Role | Light | Dark |
|---|---|---|
| Paper (`--bg`) | `#f7f4ea` | `#151613` |
| Card | `#ffffff` | `#1c1e1a` |
| Woods tint (callouts) | `#e3ead8` | `#1f2a1f` |
| Ink (text) | `#1c1b18` | `#ecebe4` |
| Muted text | `#4e4a42` | `#b8b4a8` |
| Water blue (action) | `#1d4c74` | `#8cbde3` |
| Contour brown (rules, motifs) | `#683f1b` | `#ddb38c` |
| Band | `#1c1b18` | `#262822` |
| Text on band / muted / links | `#f7f4ea` / `#d6d1c2` / `#b9d6ee` | `#ecebe4` / `#c9c5b8` / `#a9cdea` |
| Hairline (decorative) | `#d3cab6` | `#3a3c35` |

Measured with the WCAG formula (same math as `npm run check-contrast`). Every text pair is 7:1 or better.

| Pair | Light | Dark |
|---|---|---|
| Ink on paper, card, tint | 15.65 / 17.22 / 13.96 | 15.20 / 14.06 / 12.47 |
| Muted on paper, card, tint | 8.01 / 8.82 / 7.15 | 8.76 / 8.11 / 7.19 |
| Water blue on paper, card, tint | 8.16 / 8.98 / 7.28 | 9.09 / 8.40 / 7.45 |
| Card text on a blue button | 8.98 | 8.40 |
| Text on band, muted on band, links on band | 15.65 / 11.28 / 11.41 | 12.47 / 8.63 / 8.95 |
| Contour brown on paper (non-text) | 8.24 | 9.43 |

Checked with the site's own axe run (`check-a11y`, copied to switch the look on) on 37 pages, light and dark at 390px: 0 problems once the preview bar is set aside (see known issues). No sideways scroll at 320px with text at 100% or 200%, or at 1280px.

## Type

No new font: **0 KB added.** Headings, labels, buttons and the menu use Atkinson Hyperlegible Next (already loaded); reading text stays on the system font. The scale is fixed at five sizes:

| Use | Size |
|---|---|
| Labels, meta lines, sources, dateline | 15px (0.9375rem), labels in spaced capitals |
| Body | 18px (1.125rem) |
| Card titles, door names, lede, side heads | 21px (1.3125rem) |
| Section heads in one column | 26px (1.625rem) |
| Page title | 30px on phones to 44px wide (`clamp(1.85rem, 1.25rem + 2.6vw, 2.75rem)`) |

Water names in italic: the brief allowed Source Serif 4 if the bytes fit. A subset would add about 20 KB to every page with the footer, so this look uses the phone's own serif italic instead (Georgia on iPhone and Windows, Noto Serif on Android), at 0 KB. It shows only on the 404 label.

Weight: the stylesheet is 4.6 KB compressed. The three SVGs are 0.6 to 1.1 KB compressed each (ridge 1.0, ridge line 1.1, contours 0.6), loaded only by visitors who chose the look. The 404 is the only page that loads all three.

## What I left out, and why

- **Source Serif 4** (about 20 KB): too heavy for a small italic detail. See above.
- **Survey ticks and quilt corners:** a second motif family would break "one motif, used the same way everywhere." The land profile and its contours are the only drawings.
- **The contour strip on phones:** at 390px it read as noise above every heading, so phones get only the heavy rule.
- **Anything near the crisis strip, Quick exit and tab bar:** they keep their layout. They only pick up the palette and square corners; the tab bar's current marker is a 3px bar instead of a tinted pill.
- **Moving the disclaimer on Where to stay tonight (T13):** that is a content and layout change on a high stakes page, not a look.
- **Road red** from the Topo palette: it reads as "warning."
- **Gold, yellow, round marks, state symbols, coal or poverty imagery:** none, per the research risks tables.

## Known issues

- **The preview bar from #1392 covers the phone tab bar.** It sits at the bottom left, over the Dates and Topics tabs, and axe flags its links as too small (target size). This is the shared preview mechanism, not this look; it does not affect residents.
- **Dark mode band:** `#262822` on `#151613` is only 1.22:1, so in dark mode the header band is set apart mostly by the light rule under the menu, and the footer ridge is a quiet silhouette. Text on the band passes 7:1.
- **Side heads cover the margin column only.** A very long head next to a very short section could run into the next section; `min-height` on the first block guards the common case. Headings inside cards, callouts and Trailhead steps stay inline.
- **The 404 is found with a CSS `:has()` test** on its button row, since the page has no class of its own. A browser without `:has()` shows the 404 without the profile.
- **The ridge and contours are stretched** to fit the width, not to scale. The SVG comments and the footer caption say so.
- **Sources for the drawings:** USGS 3DEP elevation through the National Map Elevation ImageServer (a 600 by 240 grid over 39.60° to 39.66° N, 80.03° to 79.88° W), queried November 1, 2026. Public domain. The profile matches the phase 1 sample: 797 ft at the river, about 1,397 ft on the east ridge.

## Screenshots (390px)

- [Home, light](fieldguide/home-390-light.png) and [dark](fieldguide/home-390-dark.png)
- [Start a business route](fieldguide/start-a-business-390-light.png)
- [Dates](fieldguide/calendar-390-light.png)
- [404, dark](fieldguide/404-html-390-dark.png)
