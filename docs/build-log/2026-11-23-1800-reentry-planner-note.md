# Reentry Planner card: say which pages describe Nebraska

Date: 2026-11-23 (UTC). Closes #2090.

## What I considered

The week 5 plan's first item is the weekly fact spot check (#1055), which is Duet's lane. Its second is #2090. The state's Reentry Planner PDF, which our `/reentry/` page links, has pages copied from Nebraska's prison system. The other choice the issue gave was to drop the link. I kept the link because the work chapter (pages 76 to 93) is still useful: job applications and how to talk about a record in an interview. A clear note keeps that, and tells people which pages may not apply.

## What shipped

- `content/resources/wvdcr-reentry-planner.yaml` has two new `notes`, shown on the card:
  - Some pages were written for Nebraska's prison system (NDCS). They name the ID page (10), the health care pages (31 and 47) and the housing page (105).
  - Those costs and rules may not apply in West Virginia. Ask DCR which ones apply, and see our Birth certificates, IDs and records page for a West Virginia ID.
- New source quote from the PDF, re-read 2026-11-23: "The State of Nebraska has laws regarding landlord and tenant relations, obligations, and rights." The job interview quote was re-read the same day.
- I found the Nebraska text on pages 10, 31, 47, 79, 88, 105, 120 and 128 of the 128-page PDF (created and last changed 2024-06-10). Pages 79, 88, 120 and 128 only name NDCS in passing (a sentence, a sample resume and the credit line), so the note names the four pages with rules.
- The discovery file's status now says what the site does about it. Telling DCR is a contact, so it stays on David's list.

## Scoreboard

Findability question q55 ("I just got out of prison. Who helps with a job and an ID?") points to the planner. Our page now flags the out-of-state pages. Check on 2026-11-29 (Findability run) that `/reentry/` still answers q55 and the note shows on the card.
