# 2026-10-30: The ridgeline becomes a tiny local skyline (#241)

- **Considered:** a different wavy line per door drawn from USGS elevation data (read as scribbles at 16px tall), and a named landmark drawing beside each door heading (distracting). Both were shown to David as screenshots and not shipped.
- **Chose:** David's direction: one straight line under the menu with very small silhouettes of places here sitting on it. Same line on every page.
- **Shipped:**
  - `site/src/lib/skyline.mjs`: the shapes (trees, a knob, hillside houses, brick downtown blocks, Wharf warehouses, the glass factory stack, a rail-trail truss bridge) and where they sit, all our own simple drawings.
  - `RidgeLine.astro` draws the skyline. On wide screens the line is the header's bottom border; on phones it is the top edge of the tab bar, with a thin halo so text scrolling behind stays clear.
  - `identity.md`: the motif section rewritten with what each shape shows, what is left out on purpose (government buildings, WVU and the PRT, churches, businesses) and the rules. Decision record `2026-10-30-0800-skyline-ridgeline.md`.
- **Checked:** 320, 390 and 1280px in light and dark, no sideways scroll, contrast check passes (the line stays decorative). "Is it too much?": the page title still comes first, one line per screen, the shapes carry no meaning, nothing looks like the city, county, WVU or a business.
- **Scoreboard:** none directly.
