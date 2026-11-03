# 2026-11-02: More free places to sit, and hours as short lines (part of #1439)

- **Asked:** David said Free places to sit on Find your people should hold more than library branches, and his phone screenshot showed library hours as one long run ("Mondays 11:30 a.m. to 6:30 p.m; Tuesdays Closed; ...").
- **Considered:** WVU's Downtown, Evansdale and Health Sciences libraries, the Mountainlair, BOPARC buildings and parks, the rail-trails and riverfront, Mylan Park, the senior centers, the Morgantown Mall and daytime drop-in centers, each checked on its own official page on November 2.
- **Chose:** only places whose own source says the public can come in or use the seats, with hours we can state. That is Wiles Hill Community Center (BOPARC: "open to the public Monday-Friday") and Hazel Ruby McQuain Park (city park rules: the public may use the seats, benches and tables when no event is scheduled). The rest wait for #1439:
  - WVU libraries: hours are published, but change almost every week this fall (Election Day, Thanksgiving week, finals), and no page says in plain words that visitors may come in.
  - Mountainlair: only spring hours are posted.
  - Senior centers: Westside says members are 50 and older and pay $10 a year; no page says non-members can drop in. Senior Monongalians publishes no building hours. Clay-Battelle's own page is from 2010.
  - Mylan Park needs a pass; the mall says nothing about seating; we found no daytime drop-in center with published hours.
- **Shipped:**
  - `opening_hours` on places (the same shape resources use) and `hoursLines()` in `site/src/lib/listing.mjs`, which groups days with the same hours: "Monday and Wednesday: 11:30 a.m. to 6:30 p.m.", "Closed Tuesday, Thursday, Saturday and Sunday". The six library branches moved their hours out of `regular`. Community center pages and flyers show the lines too.
  - `drop_in` (who can come in and sit) and a `park` kind. A building with `drop_in` joins Free places to sit with a short card that links to its own page. The section hint now counts both, and the check stops library hours from going back into `regular`.
- **Next:** #1439, the deeper research. A WVU libraries card would need hours that follow the weekly schedule, or a link to it in place of hours.
