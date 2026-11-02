# 2026-11-01: Merge duplicate IRS and NCWVCAA org records

- **Considered:** the IRS and the North Central West Virginia Community Action Association each had two org records, so each had two group pages with listings split between them (#1170, #529).
- **Chose:** kept `internal-revenue-service` and `ncwvcaa`, with every source from both copies and combined topics and summaries. `irs-tax-volunteer` now points at `internal-revenue-service`. `/groups/irs/` and `/groups/north-central-wv-community-action/` send people on to the kept pages (`site/src/lib/moved.mjs`).
- **Left off:** NCWVCAA's main phone. The two copies gave different numbers from the same page, so the merged record has none until someone checks (#1209, `docs/discoveries/2026-11-01-ncwvcaa-two-phone-numbers.md`).
- **Cost:** $0.
