# /start-a-group/: IRS step from fact records, stale "not yet" note removed

Date: 2026-11-15 (UTC). Part of #122.

## What I considered

No `for:code` + `up-next` issue was open, and no self-merge PR was open. The typed pages left on #122 were /internet/, /start-a-group/ and /sell-or-donate/. /internet/ is also edited by #1867, which waits for David, so I left it alone to avoid a conflict.

## What I chose and why

/start-a-group/ had one typed step (federal tax-exempt status). It also had a wrong note. Its "Not on this page yet" section said we could not confirm Form CD-1NP or the nonprofit annual report date and fee. Those were confirmed in #1315, which closed #798 on 2026-11-01, and the incorporation card on the same page already shows them. So the page contradicted itself.

## What shipped

- Two fact records in `content/facts/start-a-group/`, quoting the Secretary of State's Charitable Organizations page, read 2026-11-15:
  - `irs-separate-step`: tax-exempt status is a separate IRS step, and the state sends you to the IRS site and Publication 557.
  - `irs-articles-wording`: if you plan to apply for 501(c)(3), your articles must include certain wording. This was not on the page before.
- The IRS links now match the ones the state page uses (`irs.gov/charities-non-profits` and the Publication 557 PDF).
- Removed the stale "Not on this page yet" section and fixed the header comment.

## Scoreboard

Moves the count of page lines that read from fact records (#122). Check on 2026-11-21 that the freshness sweep lists both as current.
