# 2026-11-01: One search code for the search page and the search test (#1286)

- **Considered:** the search page and the search test ran different code, so the same 246 queries scored differently in the test and on the page, and a change to one did not move the other (#1286).
- **Chose:** move the page's code (its word map, filler list and ordering) into `site/src/lib/search-plan.mjs`, since the page scored better, and have both use it. Cost: $0, code only.
- **Shipped:**
  - `search-plan.mjs` now holds `SPELLING`, `SAME` (words our pages say another way), `FILLER` and `makeSearch()`, which gives `find`. `inlineSource()` hands the page the same code as an inline script. The old `STOP`, `planWords` and `searchPlan`, which only the test used, are gone.
  - `search.astro` runs `SearchPlan.find` from that script. What residents see does not change, with one fix: a typed word that is also a built-in JavaScript name, like "constructor", no longer breaks the search, because the lists are now read only for their own entries.
  - `search-test.mjs` calls the same `find`. `site/test/search-plan.test.mjs` checks that the page's inline copy gives the same answers as the module.
- **Measured** (same build, same 246 queries): the test scored 220 with the old test code and 229 with the page's code. The November 1 walkthrough rerun measured about 228 on the real page. Saved: `content/findability/search-runs/2026-11-01-0829.json`. Checked in Chromium on the built site: "rehab near me", "medicade", "constructor" and "narcan pantry" all show results with no script errors.
