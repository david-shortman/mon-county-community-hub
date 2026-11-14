# Review of the 21 listings that rested only on news or directory sources

**Why.** The source order (#1092, `docs/playbook/source-order.md`) says phones, hours, costs and who can get help come from the owner or an office. A report found 21 listings resting only on news stories or listing sites (#1827).

**What changed (all pages read 2026-11-14, robots.txt checked first):**

| Listings | Change |
|---|---|
| 7 Westside Senior Center events | Added the City of Westover's Westside Senior Center page as the source for the phone and address. Dates still come from the Dominion Post Senior news column (the one-time event rule), now with the November 13 column added and the outlet named on each source. |
| Arnettsville Holiday Bazaar | No own page a robot can read (Facebook only). Re-read both Dominion Post stories and named the outlet. Fits the one-time event rule. |
| WV Card Show holiday show | Re-cited to the show's own page: 10 a.m. to 5 p.m., free, over 150 tables, at the Hazel and J.W. Ruby Community Center. |
| Fairmont Armory Christmas Craft Show | Re-cited to Vincent's Promotions' own page for dates and place. Hours, cost and vendor count came only from FestivalNet, so they were taken off. |
| 3 mall card shows | No organizer or mall page could be read. Listing sites disagree on hours and cost, so those were taken off. Dates stay, marked as coming only from listing sites, and drop off when they pass. #1903. |
| Gallery 304, Old School, That's So Cute!, Nonna's Antiques | Hours came only from news, so they were taken off. Added to the secondhand weekly checklist for a person to read each shop's own social page. #1898. |
| Shiny Dome Records | Added the shop's own site as a source. It gives no address or hours, so the listing stays `unclear` (not shown). |
| Cool Kid's Consignment, Eloquence, Scotts Run Repair Cafe | No own page found (Eloquence's domain is parked). Already `unclear` or `likely`; no change. Listed in #1898. |

Discovery: `docs/discoveries/2026-11-14-secondhand-shops-no-readable-own-page.md`.

**Result.** `node scripts/check-source-tiers.mjs` now finds 11 listings resting only on news or directories, down from 21 (it found 22 today, with a Westside notice added since the issue). The 11 left have no owner page anyone may read: 4 calendar entries kept under the rules above and 7 shops with their hours off or already hidden.

Cost: $0.
