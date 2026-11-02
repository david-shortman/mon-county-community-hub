# 2026-11-02: "Keep exploring" on All topics (#1040, part 1)

- **Considered:** the four pieces in #1040. The life areas map needs its gap list rechecked first (the coverage map is from October 31), so it comes in a second PR.
- **Chose:** three small pieces above the A to Z, all picked when the site is built (every day), with no script and no tracking.
- **Shipped:** "Did you know?": up to three place stories from `content/places`, only places open now, one per part of the county, each with its sources and checked date. "New or changed this week": the six pages the build log named most recently in the last 7 days, linking to /pulse/. It says "new or changed" because the build log names pages it changed as well as new ones. "Show me something": one listed page, a different one each day. Code in `site/src/lib/topics-extras.mjs`, tests in `site/test/topics-extras.test.mjs`.
- **Checked:** 320px and 390px with 200% text, light and dark: no sideways scroll.
