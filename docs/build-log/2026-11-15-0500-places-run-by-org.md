# 2026-11-15: 26 gathering places now name the group that runs them (wave 20, #1983, #529)

- **Why:** wave 17's org entries lane noted that many records in `content/places/` named their group only in words (`run_by.text`), even though the group already has a record in `content/orgs/`. With `run_by.org` set, the place and the group's own page can link to each other.
- **Changed:** added `run_by.org` to 26 places. Each one was checked against the group's own page on 2026-11-14 (Morgantown date), and robots.txt allowed every read:
  - `boparc` (8): Wiles Hill Community Center, Marilla Recreation Center, Dorsey's Knob Lodge, Studio 287 open studio, and the Wiles Hill yoga, ballet, tai chi and line dancing classes. BOPARC's own pages list each one.
  - `monongalia-county-parks-and-recreation` (3): Camp Muffly, Chestnut Ridge and Mason-Dixon Historical Park, each on the county's Parks and Recreation pages.
  - `monongalia-county-commission` (1): the Mon County Center, listed under the county's Departments. Added that page as a source.
  - `monongalia-arts-center` (3): Brown Bag Concerts, Collage Club and Literary Nights, on the center's Classes and events page.
  - `arts-council-of-greater-morgantown` (First Friday, under the council's Initiatives), `city-of-morgantown` (Ruby Summer Concert Series, "The City of Morgantown and the Hazel Ruby McQuain Charitable Trust proudly present"), `country-roads-cyclists`, `community-newcomers-club`, `morgantown-pride`, `mt-pockets-theatre`, `mylan-park-foundation` (added the home page as a source), `senior-monongalians`, `smithtown-community-association`, `the-shack-neighborhood-house` and `westside-senior-center` (1 each).
- **Left alone:** `salvation-army-morgantown-family-dinner`, because an open PR (#1938) changes it. Places whose group has no org record yet are listed in #1983.
- **Checks:** `npm run check-content` (0 errors) and `npm run build`. Cost: $0.
