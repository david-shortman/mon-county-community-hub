# 2026-10-31: The calendar, one week at a time

- **Problem:** `/calendar/` had 138 dates and about 911 Tab stops (#1033). A person using only a keyboard had to press Tab hundreds of times to reach dates in December.
- **Considered:** jump links only (still hundreds of stops after each jump), fewer buttons on each card (would take away Call, Directions and Add to calendar, which people use), and grouping dates into weeks.
- **Chose:** "Coming up" now shows one week at a time. Each week is a native `<details>` box with its dates and a count. The next 7 days start open; later weeks start closed, so Tab moves past a closed week in one step. An "On this page" list at the top jumps to Open now, to each week, or past all the dates. Every date is still on the page and still found by the browser's find-in-page.
- **Works with no script.** A small script only opens a week when a link points into it (shared links and the This month page link to `/calendar/#date-name`), and opens every week before printing.
- **Result:** Tab stops on the page went from 911 to 224 (Playwright, 390px). "Skip past the dates" is the 20th Tab stop. No sideways scroll at 320px with text at 200%.
- **Cost:** $0.
