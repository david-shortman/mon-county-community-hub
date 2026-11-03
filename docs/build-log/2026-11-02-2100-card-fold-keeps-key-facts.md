# 2026-11-02: The card fold keeps cost, deadline, bring and call-first lines in sight (#1393)

- **Considered:** the two options in #1393: a keyword guard in `site/src/lib/card-text.mjs`, or splitting every long record. Splitting is under way (#1394) but slow, and high-stakes records wait for David. The guard protects every card now, and still helps after the splits.
- **Chose:** the guard. A sentence past the fold stays visible if it has a dollar amount, a fee, cost, charge or tuition, a deadline, a last day or "due on/by", "bring", or "call first/ahead/before". Visible sentences keep their original order. A kept sentence that points back ("For 2026 that is $31,920...") keeps the sentence before it. "Questions, call ..." is not kept: the card's Call button already shows the number.
- **Shipped:** the guard and tests. 18 cards change: 14 show more before More details (most visible text is now 68 words) and 4 no longer fold. No sentence matching the guard is hidden on any card. Lists and notes still fold as before.
- **Left:** the WVU student pantry card still hides its address and hours behind More details; that record needs splitting (#1394, waits for David as a food record).
- **Scoreboard:** words before the answer on the scorecard may rise slightly. Check November 9.
