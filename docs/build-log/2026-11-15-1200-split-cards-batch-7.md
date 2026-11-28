# 2026-11-15: Split long card fields, batch 7 (#1394)

- **Considered:** the remaining `check-content` long-field warnings. Skipped high-stakes cards (housing, money, food, 911 or crisis lines), the protective and personal safety order cards, election cards, and cards other wave lanes are near.
- **Chose:** four low-stakes cards. Same facts and sources; `what_to_do` is now a one-line summary, with the rest in `steps`, `options` or `notes`. "What to do" does not point at folded content.
- **Shipped:** `medicare-care-compare-nursing-homes`, `medicare-choosing-a-nursing-home`, `mtec-adult-education-esl`, `mympls-ebooks-and-languages`. Cost: $0.
- **Scoreboard:** long-field warnings in `npm run check-content` should drop by 4.
