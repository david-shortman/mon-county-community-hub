# 2026-11-14: Fix the MUB board link again (Health #1793)

- **Considered:** linking the dated meeting page (`/newsroom/mub-board-of-directors-meeting`) or the newsroom.
- **Chose:** `https://mub.org/newsroom`. The 11-06 link (`www.mub.org/newsroom/mub-board-of-directors`) now returns 404, and MUB posts each meeting's agenda as a dated newsroom page, so a single meeting page would break again. The newsroom loads and lists the agendas.
- **Shipped:** board record and Who decides now point to the newsroom; source checked date 2026-11-13. No facts changed (the Nov 17 meeting date is still tracked in #1744).
