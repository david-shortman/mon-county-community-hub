# What's nearest: Brookhaven, Star City, Booth and the west end

Research for #1416, sprint wave 15 (#529). Checked 2026-11-14 unless a line says otherwise. This is a planning note, not a page residents read. Nothing here is on the site yet; see "What could go on the site" below.

## How we measured

- **Distances are straight-line miles** ("as the crow flies"), not driving miles. Area points come from [`content/bus-map/places.yaml`](../../content/bus-map/places.yaml) (Census 2024 Gazetteer or TIGER landmarks). Addresses were placed with the Census Geocoder (geocoding.geo.census.gov, Public_AR_Current benchmark) and measured with the haversine formula. Driving distance is longer, often much longer on hill roads.
- **"Confirmed"** means we read it on the provider's own page on 2026-11-14. **"Repo only"** means it comes from a record in `content/` with an older checked date. **"List only"** means it appears only on the United Way of Monongalia and Preston Counties food list (https://unitedwaympc.org/food-hunger, PDF dated January 26, 2026), not on a page of the provider's own.
- **Library facts are repo only.** mympls.org refused our automated reads on 2026-11-14 (HTTP 403), so branch addresses and hours come from `content/places/` (checked 2026-11-01).
- **Health Right** (10 Scott Ave) is left out of distances. The geocoder placed it at a point that may be wrong; check it on a map first.

Benefits help for the whole county is the WV DoHS Monongalia County office, 114 S. High St., Morgantown, Monday to Friday 8:30 a.m. to 5 p.m., 304-285-3175. Confirmed at https://dohs.wv.gov/offices/monongalia-county-dohs-office.

## Brookhaven

| Need | Nearest | About | Status |
|---|---|---|---|
| Food pantry | Covenant Church, 802 Greenbag Rd | 3.2 mi | List only |
| Food pantry with its own page | Christian Help, 219 Walnut St, Monday, Tuesday and Thursday 9 a.m. to 4 p.m., Friday 9 a.m. to 2 p.m. | 4.2 mi | Confirmed, https://motownchristianhelp.com/programs/ |
| Clinic | Monongalia County Health Department, 453 Van Voorhis Rd | 5.4 mi | Confirmed, https://www.monchd.org/ |
| Library | Cheat Area Public Library, 121 Crosby Rd | 3.5 mi | Repo only |
| Benefits | DoHS, 114 S. High St. | 4.3 mi | Confirmed |
| Bus | Rt 8 Brookhaven: Brookhaven, Sabraton Goodwill, Downtown, Pifer. Weekdays 6:30 a.m. to 7:30 p.m., Saturday 7:40 a.m. to 7:30 p.m. | | Confirmed, https://www.busride.org/8-brookhaven |

Rt 8 reaches downtown, near DoHS and Christian Help. We found no bus to Covenant Church or the Cheat Area library.

## Star City

| Need | Nearest | About | Status |
|---|---|---|---|
| Food pantry | Scott's Run Settlement House, 41 Lady Bug Dr, Osage, by appointment, 304-435-5098 | 1.0 mi | Confirmed, https://www.srsh.org/food-pantry (its hours differ across its own pages, see below) |
| Clinic | Monongalia County Health Department, 453 Van Voorhis Rd | 1.2 mi | Confirmed |
| Library | Morgantown Public Library, 373 Spruce St | 2.6 mi | Repo only |
| Benefits | DoHS | 2.7 mi | Confirmed |
| Bus | Rt 6 Gold: stops at Star City CVS and Westover Terminal. Weekdays 6 a.m. to 7 p.m., weekends 7 a.m. to 7 p.m. | | Confirmed, https://www.busride.org/6-gold-line |

We did not find which route, if any, serves Osage or Van Voorhis Road.

## Booth and the south end

Measured from Booth (Crown in brackets).

| Need | Nearest | About | Status |
|---|---|---|---|
| Library | Arnettsville Public Library, 4120 Fairmont Rd | 3.9 mi (Crown 0.7) | Repo only |
| Food pantry | Christian Help | 4.0 mi | Confirmed |
| Clinic | Monongalia County Health Department | 4.7 mi | Confirmed |
| Benefits | DoHS | 3.7 mi (Crown 8.1) | Confirmed |
| Bus | Rt 13 Crown: Pifer, Laurel Point, Arnettsville Elementary, Westover, Booth, Opekiska Dam, Crown. Monday to Saturday 7 a.m. to 5:15 p.m. | | Confirmed, https://www.busride.org/13-crown |

Rt 13 reaches the Arnettsville library and Pifer Terminal, where riders change for downtown.

## West end: Blacksville, Wadestown, Core

| Need | Nearest | About | Status |
|---|---|---|---|
| Clinic | Clay-Battelle Community Health Center, 5861 Mason Dixon Hwy, Blacksville. Medical hours Monday and Thursday 8 a.m. to 8 p.m., Tuesday and Wednesday 8 a.m. to 4 p.m., Friday 8 a.m. to 5 p.m., Saturday 8 a.m. to noon | 0.6 mi from Blacksville, 5.9 from Core, 7.7 from Wadestown | Confirmed, https://cbhealthwv.org/locations/blacksville/ |
| Food pantry | Wadestown Food Pantry, 1902 Range Rd, Wednesday 9 a.m. to noon | 1.0 mi from Wadestown | List only |
| Food pantry | Clay-Battelle Senior Center, Blacksville, Monday, Wednesday and Friday 8 a.m. to 2 p.m. | 0.3 mi from Blacksville | List only |
| Library | Clay-Battelle Public Library, 6059 Mason-Dixon Hwy | 0.3 mi from Blacksville | Repo only |
| Benefits | DoHS | 14.9 mi from Blacksville, 20.4 from Wadestown | Confirmed |
| Bus | Rt 52 Wadestown: Westover Terminal, I-79, University Town Centre, Jere, Cassville, New Hill, Core, Mason Dixon Park, Pentress, Blacksville, Clay-Battelle High School, Bula, Wana, Wadestown. Weekdays, first run 6:30 a.m., last run 7 p.m. | | Confirmed, https://www.busride.org/52-wadestown |

**Correction to the issue:** #1416 says the west end has no care after 5 p.m. The health center's page shows medical hours until 8 p.m. on Mondays and Thursdays.

Daybrook, Fort Martin and Maidsville: we found no bus route and no map point, so no distances.

## Clinton District

Measured from the Clinton District Public Library, 2005 Grafton Rd (repo only).

| Need | Nearest | About | Status |
|---|---|---|---|
| Food pantry | Covenant Church | 4.9 mi | List only |
| Food pantry with its own page | Christian Help | 6.4 mi | Confirmed |
| Clinic | Monongalia County Health Department | 8.0 mi | Confirmed |
| Benefits | DoHS | 6.2 mi | Confirmed |
| Rides | RideMon vans in the Grafton Road (Rt 15) and Mountain Heights (Rt 14) areas. Request a ride in the app, or a friend or family member can request one for you. Vans connect to buses at the Hornbeck Road Walmart, Mountaineer Mall and Sabraton Goodwill. 304-291-7433. | | Confirmed, https://www.busride.org/RideMon (hours are on a separate page we did not read) |

## Facts we could not confirm

Tracked in #1813.

1. Library branch addresses and hours: mympls.org refused automated reads. Last known: `content/places/mpls-*.yaml`, checked 2026-11-01.
2. Wadestown Food Pantry (1902 Range Rd, Wednesday 9 a.m. to noon) and the Clay-Battelle Senior Center pantry (Monday, Wednesday, Friday 8 a.m. to 2 p.m.): list only, no page of their own.
3. Covenant Church pantry (802 Greenbag Rd, weekdays 9 a.m. to 3 p.m., third Saturday 8 to 10 a.m.): list only, and directories differ.
4. Which bus, if any, reaches Osage (Scott's Run), Van Voorhis Road (health department), Scott Avenue (Health Right) or Greenbag Road.
5. RideMon's days and hours.

## Holes in the public record

- Scott's Run pantry hours differ between its own pages and the United Way list (already logged: [Scott's Run hours](../discoveries/2026-11-01-scotts-run-hours.md), [pantry lists disagree](../discoveries/2026-11-02-pantry-lists-disagree.md)).
- Starting Points pantry and the Clay-Battelle Senior Center have different addresses on their own page and the United Way list (new: [west end pantry addresses differ](../discoveries/2026-11-14-west-end-pantry-addresses.md)).
- The health department's clinical services page gives no address or hours.

## What could go on the site (ideas, not decisions)

- **A "Nearest help" box on each town page** (#1120): pantry, clinic, library and DoHS office, each with its straight-line distance and the bus that gets there, built from records that already have sources. Food and benefits listings are high stakes, so that PR waits for David. Follow-up: #1814.
- Put these areas first in area printouts (#405) and in-person reach (#163).
- Free places to sit in these areas: Mason-Dixon Historical Park is on Rt 52 (see [free places to sit](free-places-to-sit.md)).
