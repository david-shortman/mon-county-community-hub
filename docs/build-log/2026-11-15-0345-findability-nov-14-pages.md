# Findability for pages that went live November 14 (#1956)

A findability pass on the pages merged on November 14: `/state-lawmakers/`, `/county-budget/`, `/westover-business-license/`, `/transfer-station-fees/`, `/farmers-market-vendor-rules/`, and the new explainers on `/noise/`, `/public-records/` and `/probate-steps/`, plus the `/volunteer/` and `/grow/` updates.

- **Not orphans.** Every page sets `export const page` with a door and topic, so its door page lists it. Each also has at least one link from a topic page (`/who-decides/`, `/make-it-better/when-it-gets-decided/`, `/business-by-town/`, `/recycling/`, `/sell-what-you-grow/`, `/which-office/`, `/when-someone-dies/`), except `/noise/`, which its door lists.
- **Shorter titles** (part of #939): six titles cut to about 45 characters so " | Everything Morgantown" fits in search results, with the words people search for first ("Transfer station (the dump) fees, Morgantown"). Four descriptions trimmed toward 155 characters. No facts changed.
- **Also called** words for nine pages in `content/also-called.yaml`, such as "state delegate", "the dump", "FOIA request", "executor" and "party noise permit". Each word is something the page covers.
- **Search test:** 15 new queries (9 everyday, 6 full questions). Before: 293 of 298 (98.3%). After: 308 of 313 (98.4%). All 15 new queries hit, and no query that passed before now misses. The 5 misses are the same as before. For "farmers market" the vendor rules page now comes first, ahead of `/markets/`, which the test expects; it was a miss before too and is left for the search lane.

Two searches no page answers well yet: "where do my county taxes go" (the budget page does not use those words) and "community service hours" (court-ordered hours are not covered). Neither was added to the test.

Sprint wave 19, findability for new pages lane (#529).
