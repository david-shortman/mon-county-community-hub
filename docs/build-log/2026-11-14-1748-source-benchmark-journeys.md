# Source benchmark: whole-journey measures and medical rides (#1050)

**What changed.**

- **Ninth need.** q29, a ride to a medical appointment, is in `content/findability/benchmark/tasks.yaml`. Scored today in `content/findability/benchmark/journeys/2026-11-14.yaml`: our `/medical-rides/` page scores 7 of 8 on the answer card (no "what to bring") and meets the bar; Mountain Line's NewFIT page scores 6, the 2025 Resource Guide PDF 3 (page 10, phones and websites only), and the City's PATHWAYS page 1 (bus passes, no medical ride program).
- **A fact the guide has wrong.** The guide lists NewFIT at 304-296-3680. Mountain Line's NewFIT page gives 304-296-3869 (read 2026-11-14). It also says "Four-person minimum/ride", which the NewFIT page does not say.
- **Whole journey.** New measures in the Source benchmark section of `docs/scoreboard.md`: taps, sites, calls and rough minutes, from a plain web search and from our home page. Minutes come from a fixed formula. From home, all nine needs take 1 to 3 taps on one site. From search was not scored: the top result for q29 (WVU's transportation list) answered our robots.txt check with a 403, so it was not read. The next Sunday run does all nine.
- **Provider's own page.** `score.py` now prints a note when a fact was checked against a second-hand page (our page, the guide, the city list, or a news or directory site from `content/source-tiers.yaml`). On the 2026-11-08 run it flags one: q02's official source checked a fact on the City's PATHWAYS page.

Cost: $0.
