# Contractor license page reads its facts from records

**What changed.** `/contractor-license/` now reads 16 facts from records in `content/facts/contractor-license/` (#122, tier 2 of ADR 0007), plus two city permit facts already in `content/facts/permits/`. Each record has the source's own words and a re-check window: a year for the law and the license classes, 6 months for city rules, 90 days for office hours. Each group of facts has its own source line with its own date, and says "may be out of date" when one is past due. The page's single "Sources checked October 30, 2026" line is gone.

**Re-read November 14, 2026.** WV Code §30-42-3, §30-42-6 and §29-3B-4, the Division of Labor's plumber, HVAC and database search pages, the State Fire Marshal's Regulatory and Licensing page, and the City of Morgantown's Steps to Starting Your Business, Licensing, and Permitting pages. Every page was read only after a robots.txt check. One fix: the Fire Marshal's page now lists exam dates for 2027 only, not 2026 and 2027.

**What stays typed.** The Contractor Licensing Board's own pages (how to apply, its hours and phone, its license search and complaints). `wvclboard.wv.gov` asks robots not to read it, so a person re-reads them on the monthly person sources checklist. They keep their October 30, 2026 date.

Part of #122, sprint wave 16 (#529).
