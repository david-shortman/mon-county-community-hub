# Free places to sit in Mon County

Research for #1439, sprint wave 15 (#529). Checked 2026-11-14 unless a line says otherwise. Facts here come from each place's own page. Places we could not confirm are not on the site.

The site lists free places to sit on [Find your people](../../site/src/pages/find-your-people.astro#places-to-sit), built from `content/places/` records that set `drop_in` (schema in [`content/README.md`](../../content/README.md)).

## 1. What is listed, and what we checked

| Kind of place | Listed on the site? | What the source says | Source |
|---|---|---|---|
| Public library branches (6) | Yes, since #263 | Open to everyone. Hours on each branch page. Latest close is 8 p.m., Monday to Thursday, at Morgantown Public Library. No branch opens Sunday. | mympls.org location pages, checked 2026-11-01 |
| Wiles Hill Community Center (BOPARC) | Yes | Open to the public, no fee to come in, weekdays 8 a.m. to 4 p.m. | https://www.boparc.org/wiles-hill-community-center.html, checked 2026-11-02 |
| Hazel Ruby McQuain Park, downtown | Yes | City rules let the public use seats, benches and tables when no event is on. Dawn to dusk. | City park rules PDF, checked 2026-11-02 |
| Mason-Dixon Historical Park, Core | **Added in this PR** | "Open to the public during regular park hours," no reservation needed, 8 a.m. to dusk. Pavilions may be used for picnics when not reserved. A portable restroom near the cabin. | https://www.monongaliacounty.gov/departments/parks_and_recreation/mason_dixon_historical_park/faq.php |
| Camp Muffly Park, south of Morgantown | **Added in this PR** | "Open to the public every day for general use" outside about two weeks of 4-H camp in June. 8 a.m. to dusk. Pavilions first come, first served when not reserved. | https://www.monongaliacounty.gov/departments/parks_and_recreation/camp_muffly_park/faq.php |
| Chestnut Ridge Park, near Bruceton Mills | **Added in this PR** | "During daylight hours, guests are welcome to picnic." Park hours 8 a.m. to dusk. | https://www.monongaliacounty.gov/departments/parks_and_recreation/chestnut_ridge_park_and_campground/index.php and its FAQ |
| Westside Senior Center, Westover | No | For people 50 and older, with "an annual membership fee of just $10." Open 9 a.m. to noon, weekdays. Our rule leaves out places that need a paid membership. | https://www.westoverwv.org/westside-senior-center |
| Senior Monongalians meal sites | No | Lunch for people 60 and older, weekdays 11:30 a.m. to 12:30 p.m., with a suggested gift and no required fee. The page does not say people can drop in to sit outside the meal. | https://www.seniormons.org/blank |
| Marilla Recreation Center (BOPARC) | No | "Closed for reservations" during a renovation. No open hours given. | https://www.boparc.org/marilla-recreation-center.html |
| BOPARC parks (White, Krepps and others) | No | The park pages list pavilions, trails and seasonal restrooms, and no entry fee, but give no park hours and do not say the park is open to the public. BOPARC's Know before you go page says seasonal restrooms normally close in October. | https://www.boparc.org/white-park.html, https://www.boparc.org/krepps-park.html, https://www.boparc.org/know-before-you-go.html |
| Mylan Park, Ruby Community Center | No | The sports complex is open 8 a.m. to 8 p.m. every day, but the page does not say whether people can come in without a membership or fee. | https://mylanpark.org/facility-hours/sportscomplex/ |
| WVU Mountainlair | No | Its website refused our automated read (HTTP 403), so a person needs to check it. A search snippet said it is open to the public, but we do not use snippets as sources. | mountainlair.wvu.edu |
| Hospital and clinic lobbies, malls, church drop-in rooms | No | These are private places, or their pages do not say people may sit without business there. Listing one would favor a business or say more than its owner has. | none |
| Warming and cooling sites | Not here | Warming shelters belong to #863 and wait for David, since they are high stakes. | #863 |

## 2. Gaps

From the places listed above, as of 2026-11-14:

- **Sundays:** no indoor free place to sit is listed anywhere in the county. Every library branch is closed.
- **Evenings:** after 8 p.m. no indoor place is listed. After 5 p.m. only four library branches are open, and only on some weekdays.
- **North county** (the `north` area in our place records): no library branch and no other listed place. The Shack Neighborhood House is there, but its pages describe rentals and programs, not drop-in sitting.
- **Winter:** the parks we added are open until dusk, which is about 5 p.m. in December, and outdoors. BOPARC's seasonal park restrooms normally close in October.
- **West end:** Clay-Battelle Public Library (Blacksville) closes by 5 p.m. and is closed weekends. Mason-Dixon Park is the only other listed place.

## 3. Ideas beyond a list (not decisions)

Each would need David's yes before anyone outside the project is asked.

- **Warm Welcome spaces (UK).** A campaign that marks community spaces where people can "share a cuppa" and sit for free; its site says there are over 6,000 (its own pages give different counts). Spaces are run by churches, arts groups and others, and the campaign gives them a shared sign and listing. Cost to copy here: a sign template and a list, which this site could host for free. https://www.warmwelcome.uk/, checked 2026-11-14.
- **A "you can sit here" line on official pages.** The biggest gap is not places but words: BOPARC and Mylan Park pages do not say whether people can come in and sit. A one-line statement on each page would let us list them. Cost: none, but it is the owner's choice. A `for:david` ask, since it means contacting them.
- **Hours that answer "when can I sit."** Library and BOPARC pages give hours; county parks say "dusk." Nothing to build here beyond what the site does.

## 4. How the site shows it

- The section is a list today (11 places with this PR). A filter only helps once there are more than about 15. When it grows, the fields to filter on are already in the records: `area`, `opening_hours` (which can answer "open now" and "open evenings"), `kind` (indoor building or `park`), and `tags` such as `step-free`. Restrooms and Wi-Fi have no field yet; add one only when sources state them.
- Hours stay fresh the same way as other records: each source has a checked date, and `check-content` warns when it is old.

## Follow-ups

- Content: re-check the Mountainlair, BOPARC parks, Mylan Park and Senior Monongalians by hand: #1842.
- Content: add BOPARC parks once a BOPARC page states park hours and public use (see the discovery [BOPARC park pages give no hours](../discoveries/2026-11-14-boparc-park-hours.md)).
