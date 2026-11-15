# Milepost level prop, and /contractor-license/ "How to apply" as a route

Date: 2026-11-15. Closes #240 (sprint #529, wave 19).

## What shipped

- `Milepost` takes `level` (2 by default, or 3). With `level={3}` the step title is an h3, so a route that sits under an h2 section keeps the heading outline in order.
- The matching styles in `Base.astro` and `press.css` now cover `summary :is(h2, h3)`.
- `/contractor-license/` "How to apply" (the board's 7 steps) is now a `Route` of h3 steps. The words are the same as before; each step gained a short title. Sources unchanged. The `#apply` anchor was added to the heading.
- `docs/design/presentation.md` notes the `level` prop.

## Left

Screen reader check (#369) still to do. High-stakes guides still wait for David.
