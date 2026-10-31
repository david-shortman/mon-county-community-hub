# 2026-10-30: Warn on times and deadlines written the wrong way (#413)

- **Considered:** the voice rules say times read "8 a.m.", "8:30 a.m." or "noon", and deadlines read "The last day is Tuesday, December 15." Nothing checked this, so mixed styles crept in. The brand identity session split this out of #51 for the maturity lane.
- **Chose:** warnings, not errors, in `check-content`, for hand-written orgs, resources and calendar entries. Feed snapshots are left out because they say what the feed says. Cost: $0.
- **Shipped:**
  - `site/scripts/check-content.mjs`: warns on "am"/"pm" without periods or in capitals, ":00" on whole hours, 24-hour times, and "by <month> <day>" in `what_to_do`.
  - Fixed the four entries it found, wording only, with no facts changed: homestead exemption hours, the December 12 mobile pantry time, the Marketplace deadline ("The last day is Tuesday, December 15") and the property tax discount date ("the last day to pay is Monday, March 1").
  - `content/README.md`: the rule.
- **Scoreboard:** none directly.
