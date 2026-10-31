# 2026-10-30: Make it better hub and Serve on a city board

- **Considered:** the Fix what you see page (#550) waits for David because its first version named 911. The shared parts of Make it better (the hub, the next step link and the topic) should not wait with it, so they ship here with the boards page (#290).
- **Chose:** a new `content/boards/` folder, one file per board, checked by `npm run check-content`. Open seat counts come from one source, the city's vacancy list. When a board's own page shows a vacant seat that the list does not, the card says so and points to the City Clerk, with no verdict (the "when sources differ" rule).
- **Found:** the vacancy list moved to `/210/Volunteer-Opportunities` (the old `/334/` link is a 404). It differs from the Oct 29 map: the Urban Landscape Commission now shows 2 open seats (the map said 5 on its page and 3 on the list), and the Tree Board and Historic Landmarks Commission pages show no vacant seats. The Cultural Arts Commission (1), Pedestrian Safety Board (4), Green Team (2) and BOPARC (1) pages show vacant seats that are not on the list.
- **Shipped:** 9 board entries, the hub at `/make-it-better/`, `NextRung.astro`, and `/make-it-better/boards/` with open seats first, then boards to watch, then other city boards with open seats. No member names.
- **Cost:** $0.
