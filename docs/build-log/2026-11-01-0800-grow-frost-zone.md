# 2026-11-01: Frost dates and growing zones on /grow/

- **Considered:** #442 (growing calendar) asks for frost and planting dates on `/grow/`, "general and sourced". WVU Extension still refuses automated reads (HTTP 403, even for robots.txt, checked 2026-11-01), so its planting guides stay off.
- **Chose:** a "Frost dates and your growing zone" section. Frost dates are the NOAA 1991 to 2020 normals for the Morgantown airport, read from the same rules in `content/home-year.yaml` that feed the home calendar, so they live in one place. The zone is a new fact, `content/facts/growing/hardiness-zone.yaml`, from USDA's 2023 zone map and its ZIP code lookup table: 26505 and 26508 are zone 7a, 26501 is 6b. The page links to the home calendar for phone reminders.
- **Not done:** a "what to plant now" list. That needs WVU Extension's pages, which a person has to read (#552).
- **Cost:** $0.
