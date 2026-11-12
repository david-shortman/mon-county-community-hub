# 2026-11-12: Fix broken WVDOH link on After a storm

- **Considered:** the old FAQ page redirects to a 404. `/district-four` also 404s from our checker.
- **Chose:** the WVDOH Contact Us page, which loads (200) and lists 1-833-987-6237 (833-WVROADS). It does not list wvroads@wv.gov, so the email on the page needs a human check.
- **Shipped:** source link on `/after-a-storm/` updated. Health issue #1793.
- **Scoreboard:** links check has no broken links, check 2026-11-13.
