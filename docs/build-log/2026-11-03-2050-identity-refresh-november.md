# 2026-11-03: Monthly identity refresh, November

- **Reviewed:** 20 pages added or changed in the last month, at 390px and 1280px in light and dark: home, Help now, utility bills, money, dates, all topics, moving here, choosing a care home, find a job, progress, how we check, which office, weather alerts, bus routes, grief, credit and debt, lead, recycling, a community center (Arnettsville) and the 404. The Press audit of November 2 covered the other page types.
- **Scores (0 to 3):**
  - Sense of place: 2 on most pages (dateline, place names, Coopers Rock inks, quilt corners kept small) and 3 on the community center page, which tells local history in plain words.
  - VD1 to VD5: 3 on most pages. Every page uses the right heading face (Atkinson on urgent pages, Newsreader elsewhere). None is generic, and none has drifted toward too much.
  - Bus routes and How it works: VD4 at 1 before this fix, 2 after.
- **Drifted:**
  - Rust (`--brick`), the quilt-mark ink, was used as text on bus routes (times, the "Red: unsure" key) and in the "follow one listing" explainer on How it works (examples, the "Person" tag). It is about 6:1, under the 7:1 text rule, and the guide says rust is never text.
  - In dark mode, the trip planner's menus fell back to the browser's gray (5.32:1).
  - The guide itself had drifted: five older sections still described the pre-Press look.
- **Improved:**
  - Times and dates now use hemlock. Labels use text ink, and the chart key has a small rust swatch next to the word.
  - The trip planner menus have explicit colors.
  - `check-contrast` now fails the build if any style sets text `color` to `--rust` or `--brick`.
  - `docs/design/identity.md` has a dated "What changed" line, and its older sections now match version 3.
  - axe, including AAA contrast, is clean on all 20 pages plus community centers. No sideways scrolling.
- **Learned:** Quilting may have a real local tie: a 1940s relief quilting room in Morgantown, and the Country Roads Quilt Guild today. But none of those pages would open for us, so nothing is confirmed. Notes and next steps are in `docs/design/research/2026-11-03-quilts-in-mon-county.md`. No resident feedback has been logged yet (#125, #242).
- **Noted, not changed:** the trip planner's Swap button is pill-shaped, while Press uses one 2 to 3px radius.
