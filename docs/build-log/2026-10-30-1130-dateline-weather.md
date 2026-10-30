# 2026-10-30: A dateline with today's weather

- **Considered:** after the drawn motifs were removed, David asked for quieter ways to root the site in Morgantown. Options: town names on places, a dateline, a footer line naming every town, a town filter on Dates. David picked the dateline (with a little weather and one weather symbol), town names and the town filter.
- **Chose:** the dateline first, since it shows on every page.
- **Shipped:** "Morgantown · Friday, October 30 · High 66°, mostly sunny" under the site name, muted, with one weather symbol drawn in the same style as our other icons (sun, moon, partly cloudy, cloud, rain, snow, storm, fog). Short date on phones. The forecast is fetched from the National Weather Service at build time (free, public domain, no key, no visitor data sent), links to the NWS forecast page, and hides itself if the page is from an earlier day. `identity.md` has a new "Quiet local touches" section.
- **Checked:** 320, 390 and 1280px in light and dark, no sideways scroll; one line on phones from 390px; build and contrast check pass; the build still works if the weather service is down.
- **Scoreboard:** none.
