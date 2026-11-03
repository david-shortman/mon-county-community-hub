# 2026-11-03: Place warnings stop repeating for gaps already checked (#529)

- **Considered:** `npm run check-content` printed 165 warnings. 91 of them said a place to go has no `hours`, `cost` or `get_in`. Reading the sources showed most of these cannot be fixed: BOPARC park pages post no park hours (its office hours page needs a login), many offices are listed only for mail-in or online forms, and few pages say walk-in or appointment. A warning that can never clear hides the ones that can.
- **Chose:** an optional `not_posted` list on a resource (`hours`, `cost`, `get_in`): facts someone read the sources for and did not find. The warning skips those. It is an error to list a fact the record has, so the list cannot go stale once the fact is added. A group's `meetings` now count as its hours. Documented in `content/README.md`. Nothing residents see changes.
- **Care:** `not_posted` is only for gaps someone looked for. The source's checked date says when. It never stands in for a fact.
