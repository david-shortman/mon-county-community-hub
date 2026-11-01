# 2026-11-01: Jump lists on four long guides

- **Considered:** Courts and legal help (31 phone screens at 390px), Pets and animals (27), Birth certificates, IDs and records (25) and When someone dies (17) each cover several separate needs, one per section, with no way to skip ahead (#529, wave 7).
- **Chose:** an "On this page" jump list under each lede (`OnThisPage.astro`), linking the sections' existing anchors. Each section is now one tap from the first screen. Splitting them into sub-pages would break links and change little, since each section is already its own answer.
- **Cost:** $0.
