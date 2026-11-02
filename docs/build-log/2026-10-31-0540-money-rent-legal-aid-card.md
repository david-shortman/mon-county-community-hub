# 2026-10-31: The whole Legal Aid card on /money/#rent (#803)

- **Problem:** links to `/money/#rent` landed on a short paragraph with a phone number. The full Legal Aid card (phone hours, who qualifies, how to apply online, cost) showed only after a resident picked "behind on rent" and tapped Show my steps. The source benchmark (#788, need q25) counted two taps to reach it.
- **Did:** `site/src/pages/money.astro` now shows the `legal-aid-wv-eviction-help` card inside the `#rent` section, with its cost line. The intro keeps the "call in 10 days" line, and the 211 line now has its own 211 source line. No record changed.
- **Waits for David:** the money page is a high stakes page.
