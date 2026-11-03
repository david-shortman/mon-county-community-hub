# 2026-11-03: Shorter descriptions on 55 more low-stakes pages (#1612)

- **Considered:** the wave 13 findability lane left about 60 low-stakes pages with descriptions over 175 characters. Search results show about 160 characters, so the end was cut off.
- **Chose:** rewrite each to 151 to 173 characters using only what the old description already said. Some list items are dropped; nothing new is added. Left out: pages that wait for David (After you apply, No insurance, Unemployment, and other high-stakes pages) and pages an open PR is editing (Medicaid 2027, Bus routes).
- **Checked:** `node scripts/high-stakes.mjs origin/main` lists nothing. Descriptions are not in the site search index, so the search test does not move.
- **Left:** 39 pages over 175 characters: high-stakes pages, pages that wait for David, and pages in open PRs.
- **Cost:** free.
