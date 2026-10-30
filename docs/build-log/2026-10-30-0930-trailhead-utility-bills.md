# 2026-10-30: Trailhead route on the utility bill page (#240)

- **Considered:** the utility bill guide was a long page of headings. The identity plan (#237) says every guide becomes a short route of steps, each collapsed until needed and ending in an action. The door pages already had steps, but topic pages did not.
- **Chose:** a shared route that works with no script (native `details`), tried first on `/utility-bills/`. All wording and source lines on the page stayed the same; only the structure changed.
- **Shipped:**
  - `Route.astro` and `Milepost.astro`: numbered steps on a rail, step 1 open, a short "when" label, each step a heading inside its `summary` so screen readers hear "Step 1: Call your utility first, Today" and whether it is open. Printing opens every step.
  - `/utility-bills/`: four steps (call your utility, apply for help paying, call 211, lower the bill next time), each ending in buttons to call or apply.
  - `identity.md` (how to build a route) and `presentation.md` (Step path row). #179 still covers the checklist, timeline and labeled picture blocks.
- **Checked:** 320, 390 and 1280px in light and dark, no sideways scroll, steps open with Enter and Space, contrast check passes. "Is it too much?": no new colors or motifs.
- **Scoreboard:** none yet. Next: SNAP and the other guides.
