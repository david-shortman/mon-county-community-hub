# Mountain Line stop names have no public locations

- **Found:** 2026-11-03, while building the "Plan a trip by bus" map on /bus-routes/ (#1656)
- **What we found:** Each Mountain Line route page lists its main stops by name only ("Stops along the way"), with no address or map point. The public schedule feed that would give stop locations was last saved in February 2024 and its own address does not load (#407). Of the 143 stop names on the route pages, we could place 48 using Census data or an address on an official page. Among stops shared by two or more routes, these have no location we could confirm: Colasante's Shelter (6 routes), E. Moore Hall, Law School, Life Sciences, Met Theatre, Unity Manor (3 each), Fort Pierpont, Giant Eagle, Stewart Street, Valley View and Walmart/UTC (2 each).
- **Also:** Mountain Line's "Westover Terminal" page describes Pifer Terminal at 691 Fairmont Road, so one terminal has two names: route pages for Routes 6 and 52 say "Westover Terminal" and others say "Pifer Terminal". Route 52's page spells a stop "Pintress"; the Census name for the community is "Pentress".
- **Evidence:**
  - Route pages, read 2026-11-01: https://www.busride.org/7-red-line and the others listed in content/pdf-pages/mountain-line-routes.yaml
  - Westover Terminal page, read 2026-11-03: https://www.busride.org/WestoverTerminal ("Pifer Terminal is located by Goodwill ... 691 Fairmont Road")
  - Schedule feed check: #407 (Mobility Database copy dated 2024-02-08)
  - Census point landmarks, TIGER/Line 2024: https://www2.census.gov/geo/tiger/TIGER2024/POINTLM/ ("Pentress")
- **Why it matters:** A rider who sees "change at Colasante's Shelter" cannot tell from Mountain Line's pages where that is. Trip tools and maps (ours included) cannot show these stops until a location is published.
- **Who keeps it:** Mountain Line Transit Authority.
- **Status:** open. The planner still plans trips through these stops by name, but the map does not mark them.
