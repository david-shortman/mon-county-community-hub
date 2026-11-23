# How we're doing: plain sentences show on the health cards

Date: 2026-11-22 (UTC). Part of #2019.

## What I considered

No `for:code` + `up-next` issue was open. #1941 merged on 2026-11-22, and it was what held up #2019 and the last step of #2002. #2002 added a `plain` field to six health indicator records, checked by `check-content`, but showing it on `/how-we-are-doing/` waited for #1941 because that PR changed the same page.

## What shipped

- `site/src/pages/how-we-are-doing.astro`: on each health card that has a `plain` field, the plain sentence comes first, with a link to the County Health Rankings page it was written from. Then comes the exact definition, labeled "In the source's words". Cards without `plain` are unchanged.
- That covers six cards: premature death, life expectancy, children in poverty, drug overdose deaths, unemployment, and uninsured under 65.
- No content or check changes. The sentences and their sources were already in `content/indicators/` from #2002.
- `/how-we-are-doing/` reading grade: opening 7.4, whole page 6.4.

## Not done yet

The premature death sentence still does not explain "age-adjusted". #2019 has a sourced sentence for it, from the County Health Rankings measure page. Adding it means changing that record's `plain` text, which is the next step on #2019.

## Scoreboard

Health cards with a plain sentence on the page: 0 to 6. Check on 2026-11-29 that the reading grade of `/how-we-are-doing/` stays at or under 8.
