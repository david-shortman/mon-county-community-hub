# 2026-11-01: Hard-moment pages open offline after one visit (#529, wave 8)

- **Considered:** the service worker (#150) saved Help now on the first visit and the home page, door pages, Dates and Food today from the second page on. Tonight, utility bills, after a storm, mental health, drugs and alcohol, and protective orders were saved only if a person had opened them. Saved copies never expired, so a phone offline for months could show an old shelter page as if it were current.
- **Chose:** save the hard-moment pages on the first visit, add "Call before you go." to every saved-copy note, and delete old copies on a schedule. No library, no outside service. Cost: $0.
- **Shipped:**
  - `site/src/pages/sw.js.js`: a `HARD` list (Help now, Tonight, food help and the Food today pages, utility bills, after a storm, mental health, drugs and alcohol, protective orders), saved once a page finishes loading on the first visit (about 160 KB, once; not with Data Saver or on 2G). Expiry: 3 days for Tonight, Food today and Dates, 30 days for the other hard-moment pages, 90 days for anything else. Help now is never deleted, and its note says when it is more than a month old. The saved lists are never dropped to make room for other pages. The build fails if a listed page does not exist.
  - `site/src/components/AppShell.astro`: after load, the page asks the worker to save the hard-moment list (at most once an hour).
  - `site/e2e/offline.test.mjs`: after one visit, all hard-moment pages open offline with the dated note; unsaved pages fall back to Help now; 40-day-old copies of Tonight are not shown; online pages show no note.
  - `docs/operations/offline.md` explains it in plain words. The About page's saved-copy note now lists the pages and the expiry schedule.
- **Waits for David:** it changes what Help now and the crisis pages show with no signal.
- **Scoreboard:** none directly.
