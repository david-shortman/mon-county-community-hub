# 2026-11-14: SNAP: a person who helps with WV PATH, and stolen benefits (#1690, #1764)

- **Considered:** `/snap/` named no one who helps with the online form besides DoHS (#1690). Search round 4 found that no page says what to do if SNAP benefits are stolen (#1764).
- **Checked, 2026-11-14:**
  - The library's Drop-In Digital Navigator event pages (events.mympls.org/event/17866400 and 17866413). They list "online forms and applications" among the things to ask about, 10 a.m. to 5 p.m. on the first floor. The pages do not say SNAP, so we do not either. Dates vary, so the card points to the library's events calendar.
  - WV 211's page on bfa.wv.gov says 211 refers callers to services. It does not say 211 helps fill out forms, so 211 is not named as a form helper. It stays on `/file-today/` under "Want help from a person?"
  - DoHS's January 1, 2025 notice: replacement of stolen SNAP benefits ended December 20, 2024; claims for thefts after that "will be denied"; thefts from October 1, 2022, to December 20, 2024 can still be claimed.
  - DoHS's April 17, 2025 notice and the Office of EBT page: the numbers to call (1-866-545-6502 on the back of the card, 24 hours; Office of EBT 304-558-4126; customer service 1-877-716-1212) and the protect-your-card tips.
  - USDA FNS stolen benefits page: change your PIN right away; agencies never call or text for your PIN.
- **Shipped:**
  - New record `content/resources/mpls-digital-navigator.yaml`, shown on `/snap/#help-with-the-form` and named as a helper on the WV PATH record, so it also shows on `/file-today/`.
  - `/file-today/` links to the new section.
  - `/snap/#stolen`: what to do, whether you can get the money back, and how to protect your card.
- **Waits for David:** food and benefits page (High stakes).
- **Cost:** $0.
