# Shorter titles on high-stakes pages

**What changed.** Page titles on 19 high-stakes guides (12 After you apply pages, Medicaid 2027, Unemployment, Get through this month, Before you call, Veterans, Mental health and Property tax) and the 42 What help pages are now 49 to 62 characters, down from 72 to 103. Search results cut titles off at about 60 characters, so people now see the whole name. Each title still names Mon County.

The What help titles came from the long button labels. Each pick now has a short `title` in `site/src/lib/what-help.mjs` ("Utility bill help", "for someone with a disability").

Four long descriptions are shorter too: LIEAP next steps (300 to 166 characters), Unemployment (262 to 171), Behind on your mortgage (257 to 173) and Before you call (192 to 159). No deadline, cost or condition was dropped.

**Result.** Titles over 70 characters on the build: 98 to 55. Most of the rest are group pages, which wait for David in #1748.

**Left alone.** The housing voucher page (#1750), File today and Help with drugs or alcohol (other open PRs change those files).

Part of #939 and #1612, sprint wave 15 (#529).
