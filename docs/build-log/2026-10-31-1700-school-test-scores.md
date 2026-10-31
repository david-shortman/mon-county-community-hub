# 2026-10-31: School test scores on How is Mon County doing?

- **Considered:** findability q22 (how do Monongalia County schools score on state tests?) had no answer on the site. Issue #772 left school scores and crime numbers off because ZoomWV and the FBI Crime Data Explorer need JavaScript.
- **Found:** ZoomWV renders in a headless browser. Its State Assessment Summary, filtered to "(056) - Monongalia", gives the proficiency rate by subject for each school year. The statewide numbers we read match the labels drawn on ZoomWV's own chart, which checks that we read the right series.
- **Chose:** three indicator files (math, reading, science) with Mon County and West Virginia for 2025-2026 and a trend from 2021-2022. Earlier years are left out because ZoomWV notes no tests in 2019-2020 and asks for caution with 2020-2021. The definition is ZoomWV's own note on what counts as proficient. The page says how to find Mon County in ZoomWV, and that scores are one measure.
- **Left off:** crime numbers. A direct read of the FBI Crime Data Explorer's data service was blocked by this session's safety check, and crime counts around the 2021 switch to NIBRS need a careful reading. #772 stays open for crime.
- **Cost:** $0.
