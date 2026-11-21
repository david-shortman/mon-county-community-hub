# 2026-11-15: 8 secondhand shops and lending programs now name their org record (wave 20, #1983, #529)

- **Why:** these records in `content/secondhand/` named the group that runs them only in words (`run_by`), though the group already has a record in `content/orgs/`. With `org` set, the record links to the group.
- **Changed:** added `org` to 8 records. Each was checked against the group's own page on 2026-11-14 (Morgantown date), and robots.txt allowed every read:
  - `animal-friends-thrift-shoppe` to `animal-friends-of-north-central-wv`: the Thrift Shoppe page is on the group's own site.
  - `goodwill-hunters-way`, `goodwill-outlet-mall-rd` and `goodwill-westover` to `goodwill-of-north-central-west-virginia`: its Retail that gives back page says it runs "30+ Goodwill thrift stores". Its store list loads in the browser, so a robot cannot read each address there; the addresses were already in the records and are not changed.
  - `moto-toolbox` to `city-of-morgantown`: the booking site says the Morgantown Tool Outreach program serves City of Morgantown residents, and the City's own MOTO page is already a source.
  - `mpl-library-of-things` to `morgantown-public-library-system`: the Library of Things page is on the library's own site.
  - `retails-m-snap` to `m-snap`: M-SNAP's page calls ReTails "our special thrift store".
  - `salvation-army-thrift-morgantown` to `salvation-army-morgantown`: the Morgantown Corps thrift store page.
- **Left alone:** `mon-valley-habitat-restore` is marked closed, and Mon Valley Habitat for Humanity's site no longer mentions the ReStore, so its own page does not confirm the link.
- **Checks:** `npm run check-content` (0 errors) and `npm run build`. Cost: $0.
