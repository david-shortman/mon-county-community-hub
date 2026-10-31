# 2026-10-31: Report links go to the fix form

- **Considered:** David said GitHub issues are kept for the people who work on the project, so every "Report a problem" and "Tell us" link that opened a GitHub issue form led residents to a page they can't use. David also asked that How this site works not center on his name.
- **Chose:** one change in the shared helper (`reportUrl` in `site/src/lib/content.mjs` now returns `FIX_FORM`), so every listing card follows, plus the hand-written "Tell us" links on each page, the footer, the README and the MCP `how_to_report_a_problem` tool. Lines that said reports are public on GitHub now say the form needs no account and is not posted. Links for things we missed ("Know a group we missed?") also go to the form, since it takes add requests (`docs/operations/group-requests.md`). The GitHub issue templates stay for people who work on the project.
- **Shipped:** How this site works now says "the owner" and points to About for the name. Its checks table is now a list, because the Site workflow's accessibility scan failed after it merged and a two column table is the likeliest thing to scroll sideways at 320px with text at 200%. That cause is not confirmed: the scan can't run in this session.
- **Not done:** the form link carries no item details, so people type the page or listing. Prefilling would need a hidden field added in Tally, which is David's account.
- **Scoreboard:** no number moves. It speaks for the project, so it waits for David (for:david).
- **Cost:** $0.
