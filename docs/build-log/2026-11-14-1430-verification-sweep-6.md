# Verification sweep 6 (sprint wave 15)

**What:** Re-checked 24 open `needs-verification` issues that are not labeled `for:david` against current official pages a script may read (#529). Every robots.txt was checked first with the site's own check (`site/src/lib/robots.mjs`); blocked sites (WVU, HUD User, wic.wv.gov, the PSC, the school district's file host) were skipped, not worked around.

**Fixed from official pages:** the property tax estimate now uses the Assessor's 2026 levy rates, 1.3176 in town and 1.0676 outside, instead of the 2025 table (#1520, #1808, with a blind second check); the MUB board's November meeting is November 17, from MUB's own agenda, and a discovery notes the city's page says second Tuesday (#1744, #1815); the 8 "After you apply" pages point to the Income Maintenance Manual's new address after every quote was found in it (#1677, #1829, waits for David).

**Closed as already done:** the winter shutoff rule, which PSC rule 150CSR3 states and `/utility-bills/` already shows (#1131); the Grey Line airport door (#1460).

**Left for a person:** 19 issues, each with a dated comment. Calls and browser checks are in the [sweep 6 call list](../operations/call-list-2026-11-14-sweep-6.md).

**Why:** a wrong rate or meeting date costs a resident money or a wasted trip. Facts we could not confirm stay off the site.
