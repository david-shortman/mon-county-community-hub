# The tax year 2026 taxpayer sheet labels its levy table 2025

- **Found:** 2026-11-02, while adding levy rates for the property tax estimate on `/property-tax/` (#1446, sprint wave 10, #529).
- **What we found:** the Monongalia County Assessor's "Important Information for Monongalia Taxpayers" sheet is titled Tax Year 2026, but its levy rate table is headed "Rate on each $100.00 valuation, Monongalia County 2025". The sheet's formula says "Assessed Value × Levy Rate = Tax" without saying to divide by 100, while the rates are printed as dollars for each $100 (for example 1.3184). Someone who follows the formula exactly gets a number 100 times too big. The sheet also does not say where the 2.5% discount is taken off.
- **Evidence:** read 2026-11-02: [Assessor, Important Information for Monongalia Taxpayers, TY 2026 (PDF), page 1](https://www.assessor.org/DocumentCenter/View/16109/Important-Information-for-Monongalia-Taxpayers-TY-2026-PDF). The sheet points to "current and archived levy rates" on the Assessor's site.
- **Why it matters:** a homeowner checking their bill cannot tell from the sheet whether these are this year's rates, and the formula as printed gives a wrong answer.
- **Who keeps it:** the Monongalia County Assessor (the sheet) and the County Commission (which sets the county levy each year).
- **Status:** open. The site's estimate tool uses these rates, says the table is labeled 2025, divides by 100 in words, and calls every result an estimate. A person should confirm the current year's rates (see the needs-verification issue linked from #1446).
