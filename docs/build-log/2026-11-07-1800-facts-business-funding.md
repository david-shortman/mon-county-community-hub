# 2026-11-07: Start or grow a business: the state funding list reads from fact records (#122)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #122 listed `/business/` next. Its typed facts are five programs from the Secretary of State's funding list, last read October 30 to November 2.
  - `/have-your-say/` came after it, but its meeting details are structured data from about ten sources, too much for this run.
- **Chose:** `/business/`.
- **Shipped:** five records in `content/facts/business/` from the Secretary of State's funding page, re-read 2026-11-07, each with the page's words:
  - WVCAP: $10,000 to $2 million
  - WV Jobs Investment Trust: $100,000 to $2 million
  - WV Economic Development Authority: $50,000 to $15 million, 304-558-3651
  - WV Grant Resource Center: 83 Beechurst Avenue, 304-293-6444
  - county economic development groups: matching grants up to $41,500
  
  The list on `/business/` renders from them, each with its own checked date.
- **Changed for readers:**
  - The EDA line now says what the state says it finances (commercial and industrial development).
  - The Grant Resource Center line no longer says "free", because today's read does not.
  - The county line no longer gives the Morgantown Area Partnership's phone number. The state's list no longer shows a Monongalia County entry, so the line points to the Partnership's card on the same page.
- **Next for #122:** `/have-your-say/` needs its body list moved to records. That is a bigger change, and several of its sources are on the city's site, which sometimes refuses reads.
- **Scoreboard:** freshness. `/business/` has no typed phone numbers or dollar amounts left. Check at the November 9 retro.
