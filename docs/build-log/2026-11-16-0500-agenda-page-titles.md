# Meeting agenda pages: shorter titles, the body's name first

Date: 2026-11-16 (UTC). Part of #939.

## What I considered

No `for:code` + `up-next` issue was open, and no self-merge PR was open.
- #2020 and #2019 wait on files that open for:david PRs change (#1840, #1867, #1941, #1915).
- #1882 (CERT) and #2014 (Granville water) need a phone call.
- #442's planting card needs WVU Extension pages we cannot read.
- No fact record is past its recheck date: the oldest was checked November 1, and the shortest window is 30 days.
- #939 still had 57 titles over 70 characters. Most are high-stakes pages already in #1858, or pages in #1840. The meeting agenda template is the one source of long titles that no open PR touches.

## What I chose and why

Search results cut titles near 60 to 70 characters. Three agenda pages were over 70: Mountain Line (76), BOPARC (73) and Land Reuse (72). Their titles ended with ": agendas in plain language", so the words people search for ended up near the cut.

## What shipped

- `site/src/pages/meetings/agendas/[body].astro`: titles now read "<body> agendas explained". When the body's name has no place in it, ", Mon County" goes at the end, for example "Westover City Council agendas explained, Mon County". The check that every title names Morgantown or Mon County still passes.
- Longest agenda title: 76 to 67 characters. All 15 are now 67 or less.
- Descriptions are unchanged.

## Scoreboard

Titles over 70 characters (no site name): 57 to 54. Search test: 327 of 331 in the top 3, the same as main. Check on 2026-11-23 that the agenda pages still show in search for "city council agenda".
