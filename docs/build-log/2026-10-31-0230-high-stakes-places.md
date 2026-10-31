# 2026-10-31: High stakes check reads content/places (#903)

- **Considered:** place records (schema v2) now hold free community meals for Find your people, but the High stakes check only read `resources`, `orgs` and `calendar` records, so #903's five meals had to be labeled `for:david` by hand. Places have no `topics`; they say what they are about in `interests` (a meal has `food`).
- **Chose:** treat `content/places/` like the other record folders, reading both `topics` and `interests`. A place with food, housing or money, or with a crisis line in its text, waits for David. Hiding a place still does not.
- **Shipped:** the rule and five more self-test cases. Tested on #903's branch: the old check found nothing; the new one flags all five meal files.
- **Cost:** $0.
