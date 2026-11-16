# After a storm: take off the WVDOH email no current page shows

Date: 2026-11-16 (UTC). Fixes #2047.

## What I considered

I followed the week 4 build queue (`docs/plans/2026-11-16-week-4.md`), top first.
- #1861 is dated November 20, so it is not due yet.
- #2047 is next: an unconfirmed email on a live storm page.

## What I chose and why

/after-a-storm/ told people to email `wvroads@wv.gov` about state road problems. I re-read the WVDOH Contact Us page on 2026-11-16. It lists 1-833-WVROADS (833-987-6237) but not that email. The two pages that once listed it, a WVDOT FAQ and the Governor's Road Maintenance page, now answer 404. CLAUDE.md says a fact we cannot confirm on a current official page comes off the site.

## What shipped

- `site/src/pages/after-a-storm.astro`: the email is removed. The 1-833-WVROADS number stays. The WVDOH source line's checked date is now 2026-11-16, the real re-read date. The other sources keep October 30, since they were not re-read.
- Discovery: `docs/discoveries/2026-11-16-wvdoh-road-email-pages-gone.md`.

The page names 911, so the High stakes check labels this for David. COORDINATION says a takedown does not wait, but `safe-merge.sh` refuses any `for:david` PR, and I will not remove the label to get around that. So the PR is kept to the removal alone, quick to check. Nothing was added. A link to the state's "Submit a Roadwork Request" form is a separate idea, not part of a takedown.

## Scoreboard

Unconfirmed facts on live pages: one fewer once this merges (week 4 goal 4). Check on 2026-11-22 that /after-a-storm/ shows no email.
