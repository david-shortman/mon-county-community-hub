# 2026-11-14: Complaint explainer ends on the city's range, not a summed 62 (#1925, part of #1440)

- **Problem:** the day line on `/noise/` put each step at the longest time the city's sheet gives for it, and labeled the end of the line "62". Each step's days come from a different rule (a visit within 24 hours, up to 20 days to fix, a court date 21 days after the citation, up to 20 more days), so 62 was our sum, not a number the city states.
- **Changed:** the tick at 62 is now 60, and in the last step a bracket spans 60 to 80+, the city's own "upwards of 60 to 80+ days". The marker stops at the start of that range. The note under the drawing now says each step's days come from a different rule, and the "About the drawing" line says the end of the line is the city's total, not one number.
- **Kept:** every day count is still in the step text, the drawing is still `aria-hidden`, and the still version (no script, reduced motion, "Turn off motion") is unchanged. `site/test/complaint-journey.test.mjs` now also checks that no tick reads 62.
- **Source:** `content/pdf-pages/morgantown-code-complaints.yaml` (City of Morgantown sheet, checked 2026-11-01). No new facts. Cost: $0.
