# What we can honestly say about the AI's energy use

Research for #495 (part of #490). The Hard questions page admits we do not know how much energy this site's AI work uses. This note covers what is published, what is not, what our own setup shows, and ways to use less. Everything was checked on October 31, 2026, unless noted.

**Bottom line:** we cannot give a number for this site. Anthropic, the company that makes Claude, has not published energy, water or emissions figures for its models that we could find. Other companies' figures for one chat question are small, but the agent work behind this site is much larger than one chat question, and outside estimates for that kind of work differ more than tenfold. We should say that plainly, give sourced context, and never call the site green or low impact.

## What Anthropic publishes

We found no per-question, per-token or total figure for energy, water or emissions from Anthropic.

- **IPO filing (Form S-1, filed October 26, 2026).** It has no energy or emissions measurements. Its risk factors say "certain of our planned data center facilities rely on dedicated on-site natural gas-fired generation," that "Our facilities separately depend on access to reliable water for cooling," and "We have publicly committed to covering the cost of electricity price increases to consumers caused by our data centers." It also describes agreements with Nscale "to spend an aggregate of up to approximately $44.6 billion over terms extending into 2033" but does not name a site. https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm
- **"Covering electricity price increases from our data centers" (February 11, 2026).** Commitments to "pay for 100% of the grid upgrades needed to interconnect our data centers," to "bring net-new power generation online," and to curtail use at peak times. No measured figures. https://www.anthropic.com/news/covering-electricity-price-increases
- **Model and system cards.** The Claude 3 model card (March 2024) said Anthropic offsets its emissions with carbon credits and aims for "net zero climate impact on an annual basis," with no numbers (https://www-cdn.anthropic.com/de8ba9b01c9ab7cbabf5c33b80b7bbc618857627/Model_Card_Claude_3.pdf). The Claude Opus 4 system card (May 2025) said "Anthropic partners with external experts to conduct an analysis of our company-wide carbon footprint each year," again with no results (https://www-cdn.anthropic.com/4263b940cabb546aa0e3283f35b686f4f3b2ff47.pdf). The 2026 system cards we opened (Opus 5, Opus 5.5, Haiku 5.5, listed at https://www.anthropic.com/system-cards) do not mention carbon, emissions or sustainability.
- **Transparency Hub** (https://www.anthropic.com/transparency): no energy, water or emissions content. The 2026 Public Benefit Report page loads by script, and our reader found nothing on these topics, so treat that one as likely, not certain.

## Published figures from others, for context

None of these are about Claude. Each is labeled with who measured it.

| Source | Figure | What it covers | Who says so |
|---|---|---|---|
| Google, August 21, 2025 | Median Gemini Apps text prompt: 0.24 watt-hours, 0.03 g CO2e, 0.26 mL of water | Includes idle machines, CPU and memory, and cooling. Leaves out training. Google says the figures "have not been verified by an independent third-party" | Google, about its own product. https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference |
| Sam Altman, June 2025 | "the average query uses about 0.34 watt-hours" | No method given | OpenAI's CEO, about OpenAI's product. https://blog.samaltman.com/the-gentle-singularity |
| Epoch AI, February 7, 2025 | About 0.3 Wh for a typical GPT-4o question. About 2.5 Wh with a 10,000-token input, and almost 40 Wh with a 100,000-token input | An estimate from assumptions, not a measurement. Leaves out training | Independent research group. https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use |
| U.S. Department of Energy, December 20, 2024 (on the Lawrence Berkeley National Laboratory report) | Data centers used about 4.4% of U.S. electricity in 2023, and may use 6.7 to 12% by 2028 | All data centers, not only AI | Government. https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers |
| International Energy Agency, April 2025 (as reported by Nature, in Scientific American, April 10, 2025) | Data centers used about 415 TWh in 2024, about 1.5% of world electricity, with about 945 TWh expected by 2030 | All data centers. The IEA page blocked our reader, so we cite the news report | https://www.scientificamerican.com/article/ai-will-drive-doubling-of-data-center-energy-demand-by-2030/ |

**Agent work is much bigger than one question.** Two people have estimated their own use of Claude Code, the same kind of tool that builds this site. Both note that Anthropic publishes no figures, so both are estimates.

- Simon Couch (January 20, 2026) estimated a median session at about 41 Wh, which he puts at 138 times a typical 0.3 Wh question, and calls his method "napkin math." https://simonpcouch.com/blog/2026-01-20-cc-impact/
- Zeke Hausfather (August 5, 2026) estimated about 170 kWh over 8 weeks of heavy use (a range of 70 to 330 kWh), with a median session of about 0.6 kWh. https://www.theclimatebrink.com/p/the-real-energy-use-of-agentic-ai

Their median sessions differ by more than ten times. That supports saying an agent session likely uses tens to hundreds of times what one chat question uses. It does not support a precise number.

**For scale:** the average U.S. home used about 899 kWh of electricity a month in 2022 (U.S. Energy Information Administration, https://www.eia.gov/tools/faqs/faq.php?id=97&t=3, page updated January 8, 2024).

## Our own setup

From `.github/workflows/`, read October 31, 2026. Four workflows call Claude. None pins a model.

| Workflow | When Claude runs |
|---|---|
| `claude.yml` | When the owner or a collaborator mentions `@claude`, or when an issue labeled `for:code` gets `up-next` |
| `claude-review.yml` | On every pull request push that changes `site/` or `content/` (up to 40 turns) |
| `health.yml` | The check runs every 4 hours and after each main build. Claude runs only when a new failure needs fixing |
| `chronicle.yml` | Once a week, on Monday |

Only the weekly Chronicle run is on a fixed schedule. The rest depend on activity. The larger share of the AI work is outside these files: Claude Duet and Claude Code sessions that run the daily loop (`docs/CHARTER.md`). Some days have several sessions at once, as on October 31, 2026, when several build lanes ran in parallel (#529). We have no count of tokens or session hours for any of it.

## What we do not know

- Any energy, water or emissions figure for Claude, per question or in total.
- Results of Anthropic's yearly carbon footprint analysis, and whether it still buys offsets.
- Which data centers and power grids serve this project's runs. News reports link Anthropic to Nscale's Mason County campus (WDTV, August 27, 2026, https://www.wdtv.com/2026/08/27/west-virginia-data-center-lands-reported-45-billion-ai-agreement-morrisey-says/), but the S-1 does not name the site, and we do not know whether that campus serves this project.
- How many tokens or session hours this project uses.

## Ways to use less

Each one trades some speed or freshness. Any change to how often the AI runs is David's call, in a `for:david` issue.

| Option | What it saves | What it costs the project |
|---|---|---|
| Review only PRs that change what residents read (skip the AI review for docs-only PRs) | Many review runs on busy days. Already true for PRs that touch neither `site/` nor `content/` | Docs PRs get no automated second look |
| Skip a scheduled run when nothing changed (no new issues, no failing check, no source change) | Runs that would end with "nothing to do" | None, if the skip check is right |
| Fewer parallel build lanes; one or two sessions at a time | Session hours on sprint days | Backlog moves more slowly |
| Use a smaller model for simple checks (link checks, formatting) | Likely less computing per run, though Anthropic publishes no per-model figure to prove it | Small checks may miss more |
| Keep plain scripts for everything a script can do (the source check, the High stakes check and the build checks already need no AI) | AI runs for routine checks | None |
| Measure first: record session counts and durations in the build log | Nothing by itself, but lets us report a real count | A little time per session |

## What we can say in public

A draft short note for the Hard questions page is in the PR for #495. It says we do not know the figure, that Anthropic has not published one, gives the outside figures with who measured them, and says agent work is much larger than one question. It makes no "green" or "low impact" claim. It waits for David.

## Sources checked

All links above were opened on October 31, 2026, except the IEA and LBNL report pages, which blocked our reader (we cite the news report and the DOE release instead), and the date of the Altman post, which comes from news coverage. Re-check by January 31, 2027, since companies may publish new figures.
