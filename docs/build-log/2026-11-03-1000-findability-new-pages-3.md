# 2026-11-03: Findability, third round: titles, descriptions, Lead and Credit and debt (#1612, #529)

- **Considered:** a sweep of every page on `main` for title and description length, and the last two lane pages to land, `/lead/` and `/credit-and-debt/`.
- **Shipped:**
  - #1649: titles of 24 low-stakes pages (were 70 to 91 characters, now 43 to 59) and their descriptions.
  - #1652: descriptions of 17 more low-stakes pages (were 240 to 347 characters, now 161 to 176).
  - #1651: "school closings" as an Also called word on Snow and ice (search test 253 to 254).
  - This PR: Lead gets links from Pregnant or new baby and For homeowners, and a list of its own; Identity theft and Scams link to Credit and debt; Lead's description is 168 characters (was 258); 7 search queries.
- **Waiting for David:** #1648 (links on Property tax, Who serves me, Medicaid waivers, Families and kids, and Credit and debt's own description and list), #1650 (What help answer pages outranked the guides for shelter, eviction and bill searches since #1597; fix 253 to 259), #1647 (decision on crisis words in search).
- **Search test:** 6 of the 7 new Lead and Credit and debt queries hit before and after. Still missed: "is there lead in my old house" (the page says "home", not "house").
- **Found:** "where can I see a doctor with no insurance" stopped finding No insurance after tonight's merges (it now shows Flu shots, School shots and Staying well). No insurance waits for David, so this is noted on #1612 rather than fixed here.
- **Not done:** about 60 low-stakes pages still have descriptions over 175 characters.
- **Cost:** $0.
