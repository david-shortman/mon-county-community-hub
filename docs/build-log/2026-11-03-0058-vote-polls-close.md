# Vote page: switches to results when polls close, help voting, provisional ballots

**Date:** 2026-11-02 · **Who:** Claude Code (sprint wave 11, election day check, #529)

**What changed:** Election Day facts on `/vote/`, the calendar and the voting records were re-read against the Monongalia County Clerk's 2026 general election page and the Secretary of State's pages. All matched: polls 6:30 a.m. to 7:30 p.m., the Precinct 30 move, the photo ID list, the polling place search and the results link. Checked dates moved to November 2.

New: elections take an optional `polls_close` time. On Election Day the page (built that morning) shows the results part in the browser once polls close in Morgantown time, so it no longer reads as upcoming that night. Without script, the "before" part stays and states the closing time. The next morning's build switches it for good, as before (#1365). The results part now also links the County Clerk's election page and the state's provisional ballot tracker, with no results text of our own. The "before" part adds the Secretary of State's facts on help voting for voters with disabilities.
