# 2026-11-14: Westover business license fees and B&O tax, as a phone page

- **Considered:** PDFs our pages already cite with no phone page yet (part of #393, sprint wave 16, #529). The City of Westover's business license form is a 30-row fee table, and its B&O tax return lists rates in a grid. `/business-by-town/` describes both forms but does not list the fees, so a business owner had to open and zoom the PDFs.
- **Chose:** `/westover-business-license/`, from `content/pdf-pages/westover-business-license.yaml`, the same pattern as `/star-city-business-license/`. Every business type, fee and B&O rate is copied as printed and checked against the page images. The license deadline sentence is quoted as printed: the form leaves the penalty amount blank, and the page says so (logged in `docs/discoveries/2026-11-14-westover-license-penalty-blank.md`). Linked from `/business-by-town/`.
- **Cost:** $0.
