# Premature death on How is Mon County doing?

Date: 2026-11-15. Part of #529 (wave 20, health indicators lane).

## What shipped

- `content/indicators/premature-death.yaml`: years of potential life lost before age 75 per 100,000 people (age-adjusted), County Health Rankings measure `v001`, for 2021-2023 from the March 2026 supplemental file. Mon County 7,338, West Virginia 12,969, United States 8,123. The definition is County Health Rankings' own, word for word, from its 2025 data dictionary. The data years come from the supplement codebook.
- The card has a chart from the 2025 trends file. It starts at 2019-2021 because County Health Rankings marks a trend break there, and the update script never draws a line across a break. So it shows only two spans, which overlap by two years.
- `TrendChart.astro`: for numbers that are not percents, axis and line-end labels are rounded the way the card shows them (before, an axis would print 13324.08), and the note under the chart names the unit instead of saying "whole percents". The right margin now fits the longest line-end label, so "West Virginia 13,324" is not cut off on a phone.
- `docs/research/2026-11-03-topic-depth.md`: gaps 2 and 3 marked done. Graduation, life expectancy and overdose deaths were already on the page.

## Why this way

The monthly County Health Rankings check (`scripts/update-chr-indicators.mjs`) already reads `v001` the same way as the other measures, so this number stays current with no new code. Nothing was computed: every number is copied from the file.

## Not done

- No plain sentence on the card saying what "years of life lost" means. Cards show only the publisher's definition, and `how-we-are-doing.astro` is changed by #1941 (open for David), so this PR does not edit the page. The page's "What these numbers do and don't tell you" section covers all cards.
- WV vital statistics and CDC WONDER were not used. County Health Rankings gives the same measure for every county from NCHS data, in files a script may read.
