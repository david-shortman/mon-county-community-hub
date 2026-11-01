# A basic household budget for Mon County

Last checked: 2026-11-01 (Morgantown date)
For issue #1258, sprint wave 9 (#529). Research only: no outreach. Shown on `/how-we-are-doing/#basic-budget` as two fact records in `content/facts/money/`.

## The two sources

| | United For ALICE Household Survival Budget | MIT Living Wage Calculator |
|---|---|---|
| Year | 2023 costs | Updated February 15, 2026, adjusted to December 2025 dollars |
| What it counts | Housing, child care, food, transportation, health care, technology, miscellaneous, taxes. "It does not include savings" | Food, child care, medical, housing, transportation, civic, internet and mobile, other, taxes |
| Housing data | Not stated in the reprint | HUD Fair Market Rents (40th percentile), October 2025 |
| Food data | Not stated in the reprint | USDA Low-Cost Food Plan, June 2025 |
| Single adult, per year | $30,672 ($15.34 an hour) | $42,121 before taxes ($20.25 an hour) |
| One adult, one child | $41,880 ($46,920 if the child is in child care) | $71,638 |
| Two adults, two children | $67,188 ($78,360 with both in child care) | $100,600 with both adults working ($24.18 an hour each) |
| Where we read it | Mon Health 2025 Community Health Needs Assessment, PDF pages 18 and 21 | https://livingwage.mit.edu/counties/54061 |

## How we could read each one

- **ALICE:** `unitedforalice.org` answered our read with HTTP 403 on 2026-11-01 (its robots.txt is a 404, but the page refused us), so we did not try again and did not work around it. The county table is printed in Mon Health Medical Center's 2025 needs assessment, which the needs register already uses. The table's line items add up to its totals (checked by hand for the single adult and two-in-child-care columns).
- **MIT:** its FAQ says "If you plan on using 10 or fewer locations worth of data, you may use it directly off the web, taking care to cite it as: Living wage data sourced from the Living Wage Institute via https://livingwage.mit.edu." We use one county and the page carries that line. Its robots.txt allows the county page.
- **HUD Fair Market Rents** and **USDA food plans** feed MIT's numbers. HUD's site still does not answer automated reads (see #740). We did not add them separately.

## Do they disagree?

Yes, by $11,000 to $33,000 a year depending on the household. They are three years apart and count costs differently, so the page shows both with their years and does not pick one. Logged in `docs/discoveries/2026-11-01-county-basic-budget-sources-differ.md`.

## Follow-up for a person

Open United For ALICE's Monongalia County page in a browser and check whether a newer budget than 2023 has been published. If it has, update `content/facts/money/alice-survival-budget.yaml`.
