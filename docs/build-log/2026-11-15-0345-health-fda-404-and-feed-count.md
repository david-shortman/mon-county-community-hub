# Health check: fda.gov 404s and how feed problems are counted

Date: 2026-11-15. Closes #1929, part of #1955 (sprint wave 19, #529).

## What I found

- The Health run on 2026-11-15 marked the links check FAIL for 6 broken links. All 6 were fda.gov pages (naloxone, medicine disposal, the flush list, take-back options, sharps, and drug use after a disaster). From a Claude Code session on 2026-11-15, each one answered 200 to both HEAD and GET, and each page title matched the page we cite. So the pages are fine; fda.gov answers the Health run with 404 at times.
- The feeds check said "Problems with 8 live feed items". Three of the 8 were notes, not problems (two feeds turned off on purpose, and Deckers Creek's feed, which is empty because its events page lists only past events). The City feed, which robots.txt blocks, was counted twice: once for being blocked and once for its saved copy being old. Four allowed feeds had saved copies just past the 14-day limit, because saved copies are refreshed by hand.

## What shipped

- `site/src/lib/link-status.mjs` decides what an answer means. 404 and 410 are broken, except a 404 from a host listed with evidence (only `www.fda.gov` for now), which is unverified with a note to open it by hand. The link still shows on every run, so a page that really moved is not hidden. A 410 from fda.gov still counts as broken. Tests: `site/test/link-status.test.mjs`.
- The feeds check counts only real problems and lists notes separately. A feed robots.txt blocks gets one line that includes the saved copy's age. The stale line says how to refresh (`npm run update-feeds` in `site/`).
- The saved feed copies are refreshed in a separate PR.

## Scoreboard

The links check should read WARN, not FAIL, on the next Health run if only fda.gov 404s remain. The feeds check should report 1 problem (the City feed, blocked by robots.txt) once the refreshed copies land.
