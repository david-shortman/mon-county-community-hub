# 2026-11-03: Fix Site build failure from "tonight" on two new pages

- **Considered:** adding the pages to the time-words allow list, or rewording.
- **Chose:** rewording. "Tonight" in the ledes of Keep learning and Choosing a care home did not fit the rule in #1378, and neither page is about a time of day. Did not weaken the check.
- **Result:** check-time-words passes. Fixes Health issue #1615.
- **Also fixed:** the a11y check then failed on /print/family/ (320px, 200% text): the multi-column sheet list spilled its last item into an off-screen column. Narrow screens now use one plain block column. The check is unchanged.
