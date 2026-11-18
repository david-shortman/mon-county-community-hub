# 2026-11-14: A standing check for the next election file (#1383)

- **Considered:** /vote/ reads `content/elections/` at every daily build. The only file, the 2026 general election, stops showing on November 30. Nothing prompted anyone to add the next one, so after that /vote/ would show no election, with no warning.
- **Chose:** two small pieces, the way the issue asked.
  - A health check line, `election-runway`. It warns when no election file runs past today plus 60 days, and says when the last one stops (or stopped) showing.
  - A monthly checklist, `content/checklists/elections.yaml`. In the first week of each month it shows the same runway line and lists the Secretary of State, County Clerk and City election pages to check. The next file comes from official pages only.
- **Shipped:** `electionRunway` and `runwayLine` in `site/src/lib/elections.mjs`, used by `site/scripts/health.mjs` and `site/scripts/checklists.mjs`. Tests in `site/test/election-runway.test.mjs`. A line in `docs/operations/recurring-checks.md`.
- **Found:** the City's election page (read 2026-11-14) says the next City Council election is April 27, 2027. No file was added yet: the election file needs a canvass date and a results link, and neither is posted. So the health check warns from today. That is the intended flag.
- **Cost:** $0.
