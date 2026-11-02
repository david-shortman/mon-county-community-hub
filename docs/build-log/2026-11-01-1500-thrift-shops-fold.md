# 2026-11-01: Thrift shops page folds each area

- **Considered:** `/thrift-shops/` was 25.9 phone screens long (390 by 844), one of the longest guide pages in the wave 7 long pages pass (#1174). It was left out of that pass because its area picker moves area sections around with a script, and folding had to keep that working.
- **Chose:** an "On this page" jump list (`OnThisPage.astro`) and one fold per area (`Fold.astro`), each with its shop count. The "Looking for something?" lists stay open, so every shop name is on the first screens and each name opens its area. `Fold.astro` now passes extra attributes (here `data-area`) to its `details`, and the area picker opens the area a person picks.
- **Checked in a browser:** 25.9 screens down to 5.9. A shop link opens its area and scrolls to the card. `#area-westover` opens Westover. Picking Mileground moves it first and opens it, also after a reload. With scripts off, all 6 areas and 18 shop cards are on the page and open with a tap.
- **Cost:** $0.
