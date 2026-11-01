# 2026-11-01: Addresses and phone numbers stay as written in phone translators

- **Considered:** Phase 0 of the languages plan (#1067): make English pages work better in the translate button of Chrome, Safari and phones, which readers can use on every page today. The site already has a `lang` on every page, a reading level check, and no images with words in them. What was left: a translator can turn "114 South High Street" into a Spanish street name that does not exist, or reformat a phone number.
- **Chose:** `translate="no"` on the fact only (the address or number, never the label) in the shared parts: call buttons, "Where:" lines on food, shop, meeting and embed cards, and helper phone links. 1,053 spots in the built site. A short how-to is in `docs/process/translations.md`.
- **Left out for now:** the site name in the header and the crisis lines. Those files are in the open Spanish PR (#1309) or are high stakes, so they wait.
- **What residents see:** no change in English.
- **Cost:** $0.
