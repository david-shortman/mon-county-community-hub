# MTEC's course catalog for adults, as a phone page

Date: 2026-11-16 (UTC). Part of #393.

## What I considered

No `for:code` + `up-next` issue was open, and no self-merge PR was open.
- #2020, #2019, #1979 and the rest of #939 wait on files changed by for:david PRs.
- The Topics explorer epic (#2025) is built and stacked in for:david PRs.
- #1882 and #2014 need a phone call.
- No fact record is due for a recheck.

#393 (official PDFs as phone pages) is the one open stream of bigger work that is safe to self-merge. I ranked the PDFs the site cites that have no phone page yet. The top ones were a 2025 resource guide, two hospital needs assessments, and a 2019 Republic guide whose facts are already in `content/facts/recycling/`. I picked MTEC's 2026-2027 Course Catalog: it is current, it is a text PDF, and it answers what adults ask: what can I learn, what does it cost, and how do I pay.

## What I chose and why

Only the adult parts. The high school programs already have their own card. The catalog is 61 pages, mostly school rules. A phone page with the adult parts lets someone find the tuition, the grant names and the class list without opening a PDF.

## What shipped

- `content/pdf-pages/mtec-catalog-2026-27.yaml`: nine short sections.
  - The free Adult Learning Center: GED, ESL, the phone number and room.
  - The Practical Nurse program: when to register, the pre-tests, and tuition as printed.
  - Paying for daytime training: Pell, WIOA, TAA, and the catalog's warning against "fafsa.com".
  - Daytime refunds.
  - Evening classes, grouped as trades, health care, computers and other.
  - Paying for evening classes: no Pell, the HEAPS grant, refunds, and the $2.00 transcript fee.
  - The evening calendar.
  - Community classes.
  - A link to the PDF.
- All 60 quoted passages were checked word for word against the PDF text. All numbers and course names were checked too. Staff names are left out.
- `/mtec-adult-classes/`: the page. It is linked from `/keep-learning/` and `/free-adult-classes/`, listed in `llms.txt`, and has search words (night classes, evening classes, LPN program, practical nursing, welding classes, HVAC classes).
- Discovery: `docs/discoveries/2026-11-16-mtec-catalog-tuition-year.md`. The 2026-2027 catalog heads its tuition table "TUITION: 2024 – 2025", and its testing part names both GED and HiSET. The page quotes both as printed.

Checks: check-content and build pass. Axe finds 0 problems in light and dark at 390px. There is no sideways scroll at 320px with text at 100% or 200%. The reading grade is 7.4 for the opening and 7.5 for the whole page. Search test: 327 of 331, the same as main.

## Scoreboard

PDFs cited by the site with a phone page: one more (#393). Check on 2026-11-23 that a search for "night classes" or "LPN program" finds `/mtec-adult-classes/`.
