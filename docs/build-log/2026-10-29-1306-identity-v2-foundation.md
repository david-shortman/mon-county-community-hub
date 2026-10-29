# 2026-10-29: Identity version 2 foundation

- **Asked:** David reviewed the Hub Identity Workshop brainstorm and approved its direction: the slider personality, the mix of the Front Door, Trailhead, and Living Ridgeline directions, a free heading typeface, 7:1 text contrast, and resident testing twice a year.
- **Shipped:**
  - Decision record and a new identity guide section for personality, design principles, "this, not that" voice pairs, and the three directions.
  - Text tokens adjusted so every text pair is 7:1 or more in light and dark (the lowest is now 7.08:1). `npm run check-contrast` now fails the build below 7:1.
  - Headings and the site name use Atkinson Hyperlegible Next 800, self-hosted, Latin only, about 11 KB, with `font-display: optional` so text never waits or jumps.
  - Fixed sideways scrolling between 641 and about 1,070px wide: the desktop menu (now eight items) could not wrap. It wraps now.
- **Checks:** axe found zero violations on all nine pages at 390 and 1280px in light and dark. At 280, 320, 390, 641, 720, 800, 900 and 1024px: no sideways scrolling. Every button and tab is still at least 48px.
- **Next:** one issue each for the Front Door home page, Trailhead guides, and the ridge library, plus a `for:david` issue for resident testing.
