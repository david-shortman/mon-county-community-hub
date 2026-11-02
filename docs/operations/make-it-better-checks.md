# Keeping Make it better current

Board seats, grant rounds and program rules change often, and a stale seat count sends people the wrong way. This is the recurring check for the Make it better pages (#288, #291): `/make-it-better/boards/`, `/make-it-better/adopt/`, `/make-it-better/grants/`, `/make-it-better/when-it-gets-decided/`, `/make-it-better/report/` and `/have-your-say/`.

It costs nothing: it uses free public pages. Nobody contacts an office, board or group. Anything that needs asking a person becomes a `for:david` issue.

The first full read of every source below was on 2026-10-30 (Morgantown date), and every entry's `checked` date says so.

## How to record a check

- Re-read the page. Change only what the page now says, and set `checked` to today's Morgantown date only for the sources you actually re-read.
- Seat counts live in `content/boards/<slug>.yaml` (`open_seats` from the city's vacancy list, `page_vacant` when the board's own page shows a different number). The other boards with open seats are `content/boards/` entries with `section: other`.
- Programs, grants and report routes live in `content/resources/` (topic `better` or `government`).
- When two official pages disagree, keep both and say who says what. Never pick one.
- A date that is not posted yet stays "next date not announced". Never guess.

## Weekly

| Source | What to look for | Updates |
|---|---|---|
| [City vacancy list](https://www.morgantownwv.gov/210/Volunteer-Opportunities) | Open seats per board, who can serve, the apply links | `open_seats` in `content/boards/` |
| [City Council agendas](https://www.morgantownwv.gov/AgendaCenter/City-Council-3) | Items on trees, murals, landscape plans, the downtown plan, budget lines, board appointments | When it gets decided, Have your say |
| Agenda Center for the Urban Landscape Commission, Tree Board, Cultural Arts Commission and Historic Landmarks Commission (linked from each board's page) | The same kinds of items, and meeting changes | Board entries |

## Monthly

| Source | What to look for | Updates |
|---|---|---|
| Each board's own page (links in `content/boards/`) | Meeting day, time and place; vacant seats shown on the page | Board entries (`meets`, `page_vacant`) |
| [Morgantown Mosaic](https://morgantownwv.gov/724/Morgantown-Mosaic-Neighborhood-Engagemen) | 2027 scoring dates, amounts, match | `morgantown-mosaic-grants`, a calendar entry once dates are posted |
| [City Finance page](https://www.morgantownwv.gov/202/Finance) | A new budget or capital plan | When it gets decided |
| [Morgantown 311](https://www.morgantownwv.gov/428/Service-Request) | Categories, phone, hours | `morgantown-311`, the report page |
| [County A&D agency](https://www.monongaliacounty.gov/departments/abandoned_dilapidated_property_enforcement_agency.php) and [county Litter Control](https://www.moncountyrecycling.com/litter-control.html) | Form links, phone, area | Report routes |
| [County Commission](https://www.monongaliacounty.gov/commission/index.php) | Meeting time, comment rules | Have your say |
| [WV DEP REAP](https://dep.wv.gov/environmental-advocate/reap/aah/Pages/default.aspx), [Adopt-A-Stream](https://dep.wv.gov/environmental-advocate/reap/Pages/Adopt-a-Stream.aspx) | Program rules, contacts | Adopt entries |
| [WV Forestry urban forestry](https://wvforestry.com/urban-forestry) | Whether Community Tree Grants are still open | `wv-community-tree-grants` |
| [WV arts grants](https://wvculture.org/agencies/arts/grants/) | Whether Public Art grants open, and the deadline | `wv-arts-public-art-grants`, a calendar entry when a deadline is posted |
| [Organizational Arts Grants](https://ycfwv.org/arts-fund-grants/) | The 2027-28 round (the page says to check back in April 2027) | `ycf-organizational-arts-grants`, a calendar entry |
| [BOPARC trail cleanups](https://www.boparc.org/trail-clean-ups-and-events.html) | How to host, insurance rule | `boparc-trail-cleanups` |
| [WVDOT District 4](https://transportation.wv.gov/agencies/highways/districts/district-four) | Phone, hours, the road repair form | `wvdoh-road-repair` |
| Main Street Morgantown, Friends of Deckers Creek, Mon River Trails Conservancy, Solid Waste Authority | New programs or cleanups with dates | New entries (and #700 for the facade program) |

## Seasonal

- **March and April:** budget season. State law has local levying bodies meet between March 7 and March 28 (WV Code 11-8-9). Read City Council and County Commission agendas weekly for budget items.
- **March and April:** REAP litter grants and Make It Shine cleanups. Check the REAP pages weekly.
- **April 2027:** the Organizational Arts Grants round should reopen.

## Automated since 2026-10-31

- **Weekly checklist issue:** the weekly, monthly and seasonal lists above are posted as one standing issue, refreshed each Monday by the daily Source check (`content/checklists/make-it-better.yaml`, see `docs/operations/recurring-checks.md`). It also lists entries that will say "may be out of date" within 30 days.
- **Daily watch:** the city vacancy list and the three grant pages whose rounds open and close (Organizational Arts Grants, WV Public Art, Community Tree Grants) are on `content/watch/make-it-better.yaml`. A change opens one issue for a person. The saved "not currently open" and "check back in April 2027" lines alert when they go away.

## Known gaps

- The site marks an entry "may be out of date" after 6 months for every topic. #291 asks for 90 days on Make it better entries. That needs a change to `isStale` in `site/src/lib/content.mjs` for one topic, which is a site-wide rule, so it is a separate issue (#791).
- City Council's public portion rules, and the County Commission and school board speaking rules, are not on any page we found.
- Open questions: #700 (downtown facade program), #757 (county Parks and Trails levy), #710 (Adopt-A-Street details).
