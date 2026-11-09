# 2026-11-09: Teen drivers reads its license rules from fact records (#122)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #122's last update named `/noise/` and `/teen-drivers/` as the next pages that are not high stakes. `/holidays/` has dated food items, so it would wait for David.
  - Small title fixes for #939 are left. They are polish, not a fix for something wrong.
- **Chose:** `/teen-drivers/`. It gives teens and parents ages, hours, passenger limits and fees. A stale rule there could cost a family a failed test or a ticket.
- **Shipped:**
  - 21 records in `content/facts/teen-drivers/`. Each has the DMV graduated driver licensing page's own words, re-read 2026-11-09. A script checked that every quote appears on the page word for word.
  - Each of the three steps lists its rules from the records and has its own source line. The line says "may be out of date" once any rule is past its 180-day re-check.
  - The bottom note no longer has its own typed date.
- **Changed for readers:**
  - **The 10 p.m. exception is narrower now.** The page said "an emergency". The DMV's words are an emergency where you must drive to keep someone from being hurt or killed.
  - **The parent guide is no longer called free.** The page called it "a free practice driving guide", but the DMV calls only the RoadReady app free.
  - **New lines from the DMV page:**
    - Seat belts for everyone and no alcohol at all, at every step.
    - The intermediate license ends on your 18th birthday.
    - With a full license, tickets add points.
  - The permit's signer now reads "a parent or legal guardian", closer to the DMV's list.
- **Scoreboard:** freshness. `/teen-drivers/` has no typed rules left. Check at the November 15 findability run.
