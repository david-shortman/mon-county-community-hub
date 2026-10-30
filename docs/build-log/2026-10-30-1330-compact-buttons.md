# 2026-10-30: Buttons sized to their label (#335)

- **Considered:** action buttons sat in a grid with columns at least 9.5rem wide, so secondary buttons stretched to half the row at 390px and stacked at 320px. David asked for compact buttons that sit side by side and wrap as a group, with only the main action full width. Handed over from the trust signals session, which shipped the short labels in #345.
- **Chose:** a wrapping flex row. Secondary buttons hug their label; `.btn-primary` and the wide Call slot span the row; the home page Help now pair keeps two equal columns.
- **Shipped:** the change in `Base.astro`, a "Compact buttons" note in `identity.md` (and the container query from #386 removed, since a wrapping row already handles narrow cards). Before and after screenshots at 390 and 320px in `docs/design/screenshots/2026-10-30-buttons-*`.
- **Checked:** 7 pages at 320 and 390px, no sideways scroll, every button still at least 48px tall; build and contrast check pass.
- **Scoreboard:** none.
