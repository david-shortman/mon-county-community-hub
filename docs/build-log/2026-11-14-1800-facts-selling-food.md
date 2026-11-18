# /selling-food/: bake sale lines read from fact records

Date: 2026-11-14. Part of #122.

## What

- Two new fact records in `content/facts/selling-food/`: `nonprofit-exemption` (some 501(c)(3) groups can sell certain foods without a permit, call Environmental Health at 304-598-5131) and `bake-sale-forms` (the page has a Bake Sale Application and an Exemption Application).
- The "A bake sale, or a nonprofit selling food" section of `/selling-food/` now renders those two records with `<Fact>`, so each line carries its own source, checked date and recheck flag.
- The button now points to the health department's dedicated "Bake Sales and Non-Profit Organizations" page.

## Why

The old section cited the Environmental Health page and the temporary-event page. When re-read on 2026-11-14, the forms and the nonprofit line were on the dedicated service page instead, so the source now matches where the words are.

## Skipped

The street vending slice of the same page was the first choice. The city site (morgantownwv.gov) reset the connection twice, so per the budget rule it was left for a later run.

## Checks

`check-content` and the site build pass. The rendered section shows both fact lines with their source line.
