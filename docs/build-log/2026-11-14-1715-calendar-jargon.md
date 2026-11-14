# 2026-11-14: Calendar and agenda wording, plus a jargon check (#103)

- **Considered:** every hand-checked item in `content/calendar/` that is still on the site, and the agenda guides for coming meetings in `content/agendas/`, for words a resident may not know (rules PL4 and PL5 in the plain language rubric). Items with topic housing, money or food wait for David, so they go in a separate PR.
- **Chose:** explain each word in a few plain words in the same line, since cards are plain text. The site already has a glossary for meeting words at `/meetings/how-to-read-an-agenda/`, so agenda guide labels like "Consent agenda", "Public hearing", "First reading" and "Executive session" now link to their section there. No new tooltip pattern.
- **Shipped:**
  - Agenda guides: variance, condemnation and right-of-way, MPO, fiduciary orders and TIF district are explained. Agenda titles, dates, places and names are unchanged.
  - Calendar: NRCS conservation, Board of Health, Star City council, Morgantown council election and United Way funded partner items now speak to "you" and explain easements, MCHD, DoHS, wards and "funded partner". The United Way page was re-read on 2026-11-14; other `checked` dates are unchanged because no fact changed.
  - `site/scripts/check-calendar-jargon.mjs`: a warning-only check in `npm run check-content`, with a self-test. It lists calendar items that use a listed word with no explanation, or that cite a law in the card text. Today it warns on 5 items, all high-stakes ones handled in the follow-up PR. Cost: $0.
