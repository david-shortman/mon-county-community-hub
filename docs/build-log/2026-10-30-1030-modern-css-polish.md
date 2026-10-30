# 2026-10-30: Modern CSS polish for phones (#153)

- **Considered:** the items in #153: even line breaks, cards that adapt to their own width, the type scale at 320px, and a browser bar that matches the page.
- **Chose:** CSS and meta tags only, no layout changes.
- **Shipped:** `text-wrap: pretty` on paragraphs and list items (headings already balance); cards and route steps as size containers so their action buttons stack when the card is narrow; the `h1` eases to 1.7rem on the smallest phones; `theme-color` meta tags for light (`#f9f7f2`) and dark (`#161714`). Noted in `identity.md` under "Mobile first".
- **Checked:** 8 pages at 320, 390 and 1280px in light and dark against main: no sideways scroll, pages a few pixels shorter at 320 and 390 (fewer orphan words, smaller `h1`), no change at 1280. Build and contrast check pass.
- **Scoreboard:** none.
