# "What happens next" fields on shelter, utility bill and food records (part of #716)

**What:** Filled the optional `what_to_bring` and `what_happens` fields (#159) on five records, using only their own official pages, read 2026-10-31:

| Record | Added | Source |
|---|---|---|
| `grace-shelter` | what happens: 45-day housing goal, referrals, partner services | ccwva.org Grace Shelter page |
| `wv-emergency-assistance-utility` | bring the disconnect notice; one-time payment applied to the account | Mon Power assistance page |
| `mon-power-payment-help` | check online or call for an installment plan | Mon Power assistance page |
| `dollar-energy-fund-mon-power` | bring a utility bill and proof of income for everyone at home; how the review works; can apply online | dollarenergy.org |
| `apply-for-snap-wv-path` | interview, benefits from the date DoHS gets the signed form, 7-day SNAP for some households | SNAP application DFA-SNAP-1 Rev. 7/26 |

**Where it shows:** the box shows on `/stay-tonight/` (Grace Shelter) and `/help/food/monthly/` (SNAP). `/utility-bills/` writes its text by hand instead of using cards, so the three utility records do not show the box there yet. Five open PRs edit that page, so it was left alone.

**Skipped:** `lieap-heating-help` (open in #755), `rdvic-hotline` (open in #748), `the-rack-wvu-student-food-pantry` (#935), `monongalia-county-dohs-office` (#535), `starting-points-family-programs` (#866). `mub-customer-service`: MUB's site says nothing about what to bring or what happens.

**Found a conflict:** Mon Power's page gives 800-683-7036 for Dollar Energy Fund, and dollarenergy.org gives 1-888-282-6816 for utility help. The record keeps the existing number; #1010 tracks it.
