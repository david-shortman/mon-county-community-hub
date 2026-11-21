# Phone links in sentences: no longer covered by a wrapped link

Date: 2026-11-15 (UTC). Fixes #2034.

## What I considered

No `for:code` + `up-next` issue was open, and no self-merge PR was open. #122 has no more self-mergeable pages: /internet/ waits on #1867, and /check-a-charity/ is about money. I re-checked #2014 (Granville water). The MUB tariffs page only loads with JavaScript, so I added the lead to the issue and left it for a person. That left #2034, a live accessibility bug.

## What I chose and why

#2034: on /start-a-business/, the health department number (304-598-5131) in the "Selling food?" fact failed axe's target-size rule (WCAG 2.5.8). I reproduced it locally in light and dark at 390px.

Cause: since #1962, phone links in text are inline blocks, so they stay whole and move to the next line. An inline block sits about 3px higher than the text around it. Here the next link ("Environmental Health page") wraps onto the next line, and its box covered all but 3px of the number. Axe calls that "partially obscured".

Why CI missed it: line breaks depend on the fonts installed. The CI runner's fonts break this sentence in a different place, so the two links do not touch there.

## What shipped

- `site/src/styles/press.css`: phone and text-message links in sentences get `position: relative`. That paints the number above a wrapped neighbor link, so a tap where they overlap goes to the number. It does not move anything on the page, so the #1962 big-text fix still works.
- Tested: the page has 0 target-size failures in light and dark. `display: inline` also passed, but it would undo #1962. Changing `vertical-align` did not help.

## Scoreboard

Blocking accessibility failures on a local run: 2 to 0 on /start-a-business/. Check on 2026-11-22 that `npm run check-a11y` still reports 0 blocking issues.
