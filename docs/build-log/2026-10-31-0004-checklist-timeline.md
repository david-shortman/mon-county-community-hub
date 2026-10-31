# 2026-10-31: Checklist and timeline blocks

- **Considered:** #179 asked for a checklist, a timeline and a labeled picture for "How do I..." pages. The step path already exists as `Route` and `Milepost`.
- **Chose:**
  - `Checklist.astro`: real checkboxes, so they work with no script but forget their ticks. With a script, ticks are saved on this phone only (localStorage), never sent anywhere, and a "Clear ticks" link empties them. Every read and write is wrapped, so a private window still works. First use: "What to have ready" in `WhatHappensNext`, on every card with `what_to_bring` (Mon Power and Hope Gas start service today).
  - `Timeline.astro`: an ordered list of `{ when, text }` on a rail. No page uses it yet; a court or legal timeline must cite a court or legal aid source.
- **Not built:** the labeled picture. It needs a real notice to draw, chosen with Duet.
- **Checked:** Playwright: tick, reload, still ticked; Clear ticks empties it; with scripts off the six boxes show and the saving note stays hidden. `npm run check-a11y` adds no problems.
- **Cost:** $0.
