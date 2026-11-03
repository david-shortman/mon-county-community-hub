# 2026-11-03: Food: SNAP work rule details and Summer EBT (#1534)

- **Considered:** round two of the needs coverage lane re-checked "Having enough food". The main path (food today, SNAP, WIC) holds up, but `/snap/` gave only the ages for the work rules, and nothing on the site mentioned Summer EBT. Every Mon County Schools student eats free, so families never fill out a meal form, and the state says families at those schools must apply for Summer EBT.
- **Shipped:** the 3 months in 36 time limit, the 80 hour rule (unpaid work and volunteering count) and the 2025 removal of exemptions on `/snap/`, from the DoHS fact sheet and article. A new record `wv-summer-ebt` on `/school-age/#meals`. The need stays good; SNAP and WIC dollar limits are added to its gaps.
- **Left:** SNAP and WIC income limits in dollars (the state's SNAP table has no effective date), replacing SNAP food lost in a power outage, and the senior food box (no official Mon County pickup site found).
