# After you apply: name the manual before quoting it

**What changed.** Eight After you apply pages quote "the manual" or "the rules" many times. Each page's note near the top now names the book and links its official page:

- SNAP, Medicaid, WV WORKS, LIEAP and Medicare Savings: the state's Income Maintenance Manual, the rules DoHS workers follow (https://bfa.wv.gov/income-maintenance-manual, read 2026-11-14).
- Child care: the state's Child Care Assistance Policy and Procedure Manual, dated October 1, 2024 (https://bfa.wv.gov/child-care-policy, read 2026-11-14). The Families and kids page names it too.
- SSI and Social Security disability: the federal rules in Title 20 of the Code of Federal Regulations (parts 404 and 416; part 418 for Extra Help on the Medicare Savings page).

Each note adds one line on why it matters: these are the rules the program runs by, so a resident can point to them if something seems wrong.

**A check keeps it from coming back.** `site/scripts/check-reading.mjs` now fails the build if a page says "the manual" before it names a manual (a capitalized name ending in "Manual"). It found the 8 pages above before this change. Test: `site/test/reading.test.mjs`.

**Not changed.** The source lines still cite the manual file read on 2026-10-31. That file's link is broken; re-reading the new edition and updating the links is #1677. The housing voucher page is in an open PR (#1750), so it was left alone; it says "the federal rules", not "the manual".

**Why.** David's feedback on Nov 1 (#1368): the WV WORKS page said "The manual says" many times but never said whose manual.
