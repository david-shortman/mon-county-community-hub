# 2026-10-31: Utility bills page shows this season's LIEAP dates from the record

- **Fixed:** the "This season" line on `/utility-bills/` was typed into the page and still said 2026-27 LIEAP dates were not found, after #755 put them in the `lieap-heating-help` record. The line now shows the record's `what_to_do`, so it says DoHS starts mailing applications Monday, November 2, 2026, and the last day is Wednesday, November 25, 2026 (from the DoHS release cited in #755). Closes #1046.
- **Added:** `site/scripts/check-season-dates.mjs`, run by `npm run check-content`. It fails when a page line says a date was "not found" or "not announced" while a record that line uses names a date that is today or later. It tests itself first. It only looks at lines that use a record, so it is narrow on purpose; the general check is #1056.
- **Waits for David:** this is a benefits page (#515).
- **Cost:** $0.
