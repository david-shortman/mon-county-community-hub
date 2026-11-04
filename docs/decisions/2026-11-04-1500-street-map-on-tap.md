# A street map for the bus planner, loaded only on tap

- **Date:** 2026-11-04
- **Decided by:** David, in a Claude Code session (picked all four recommended options)
- **Decision:**
  1. **Engine:** MapLibre GL JS, pinned to an exact version. It is open source, needs no account or key, and costs nothing at any traffic. Not Mapbox, which needs an account and a key.
  2. **Base map:** our own, made from Census TIGER/Line (streets with names, water, parks, campuses, the county line) by `site/scripts/make-street-map.py` and hosted with the site in `site/public/bus-map/`. Public domain. No OpenStreetMap data, as the images guide says. Labels use Noto Sans glyph files (SIL Open Font License) hosted with the site.
  3. **Weight:** an exception to "no embedded maps" for this one map. The street map's code and data load only when someone taps "Expand map" on /bus-routes/. The page itself keeps the small drawn map and stays inside its budget. If WebGL or the download fails, the drawn map opens instead.
  4. **Bus lines on streets:** only from Mountain Line's own route file, once they share a current one and say we may reuse it (#26, #1447). Until then the street map shows places and numbered trip markers, and never guesses a bus's path.
- **Why:** David found the drawn map hard to read on a phone and asked for a much cleaner, Mapbox-like experience (#1721). Each choice keeps the cost at nothing, keeps the rules on accounts and data, and keeps the page fast for everyone who does not open the map.
- **Also:** "Show my location" uses the phone's own location only to draw the dot. Nothing is sent anywhere.
- **Revisit when:** Mountain Line's route file is available, or when another page needs a street map (then make it a shared component).
