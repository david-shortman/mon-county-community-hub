# 2026-10-30: No sideways scroll at large text on the crisis and money pages (#332)

- **Considered:** #332 was the only thing wrong on the live site that a session could fix, and one of the two pages is the crisis page (Stay tonight).
- **Chose:** fix the shared styles so the layouts adapt to large text, while keeping today's layout at normal size.
- **Shipped:** in `site/src/layouts/Base.astro`:
  - The crisis strip wraps when text is large, so "Leave this page" moves under the warning instead of squeezing "Danger? Call 911" into a narrow column. At normal size it stays side by side.
  - The "Can't wait" call and text buttons on door pages stack at large text and stay in one row at normal size.
  - Screen-reader-only labels are pinned inside the page so they cannot push it wider.
  - The hidden "Skip to main content" link is moved further off screen; at 200% text it was peeking in at the top.
- **Checked:** all 26 pages at 320px with 100% and 200% text: no sideways scroll. Screenshots of the crisis strip at 320px (100% and 200%) and 390px.
- **Scoreboard:** accessibility rubric A5 (zoom and reflow); the next design review (#104) should score it.
