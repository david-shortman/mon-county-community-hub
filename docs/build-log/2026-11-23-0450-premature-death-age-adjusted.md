# Premature death card: say what "age-adjusted" means

Date: 2026-11-23 (UTC). Closes #2019.

## What I considered

The week 4 queue items that need no David merge were done or blocked. #2019 had one step left after #2086: the premature death card's plain sentence did not explain "age-adjusted", which is in County Health Rankings' definition.

## What shipped

- `content/indicators/premature-death.yaml`: the `plain` text now ends with "The number is age-adjusted, so counties with older or younger people can be compared fairly."
- The source is the CHR measure page, re-read 2026-11-22 (Eastern date): "We report an age-adjusted rate in order to fairly compare counties with differing age structures."
- To stay under the 45-word limit, I dropped two parts. "and a death at 70 adds 5" was a second example of the same rule. "Deaths at 75 or older do not count" is already implied by "before age 75".
- The sentence is now 41 words, reading grade 5.2. The `checked` date is 2026-11-22.

## Scoreboard

Health cards whose plain sentence explains every term in the definition: premature death joins the others. Check on 2026-11-29 that `/how-we-are-doing/` still reads at or under grade 8.
