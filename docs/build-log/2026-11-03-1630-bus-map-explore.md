# 2026-11-03: Bus trip map: expandable and explorable (#1708)

- **Why:** feedback that the trip map on /bus-routes/ needs to be expandable and explorable.
- **Built:**
  - **Expand map:** opens the map full screen (a modal dialog: Esc or Close returns you to the page). Zoom with + and -, a pinch or a mouse wheel; drag to move; Fit resets. Names, dots and lines keep their size on screen while zooming, so more place names fit as you zoom in.
  - **Tap a place:** its routes light up, and a panel lists each one with that day's hours, plus "Start here" and "Go here" buttons that fill in the trip.
  - **Tap a route** (on the map or in a panel): that route lights up, and the panel shows its hours and its places in stop order, with its stops that are not on the map named in text.
  - **"Look at a place or route" list:** does the same without touch, for keyboards and screen readers. The map stays hidden from screen readers; every fact is in the panel text.
- **How:** no library. Zoom changes the SVG viewBox; a CSS variable scales dots and names back to screen size; lines use non-scaling strokes. Wider invisible tap targets sit on top of each place and line. Code: `site/src/lib/bus-map-client.mjs`; panel words in `site/src/lib/bus-trips.mjs`.
- **Cost:** none.
