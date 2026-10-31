# 2026-10-31: High stakes check catches crisis lines in code files (#776)

- **Considered:** the High stakes check read page files and `content/` records, but not `site/src/lib/` or components. The helper cards in #776 keep 988, 211 and 911 steps in `site/src/lib/helper-roles.mjs`, so the check did not label that PR `for:david`; it was labeled by hand.
- **Chose:** for any other changed file under `site/src/` or `content/`, read only the lines the PR adds or removes. If one names a crisis line (988, 211, 911, 211's text line 898-211, the Veterans Crisis Line text 838255, the RDVIC hotline, the VA homeless veterans line) or the slug of a record that holds one, the PR waits for David. Reading only changed lines keeps small edits to shared components that already show 911 from being flagged.
- **Shipped:** the rule and `node scripts/high-stakes.mjs --self-test`, now run by `npm run check-content`. Page and content rules are unchanged. Tested against #776's branch: the old check found nothing; the new one flags both files.
- **Cost:** $0.
