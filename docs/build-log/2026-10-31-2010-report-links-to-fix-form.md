# 2026-10-31: Report links go to the fix form

- **Considered:** David said GitHub issues are kept for the people who work on the project, so every "Report a problem" and "Tell us" link that opened a GitHub issue form led residents to a page they can't use. David also asked that How this site works not center on his name.
- **Chose:** one change in the shared helper (`reportUrl` in `site/src/lib/content.mjs` now returns `FIX_FORM`), so every listing card follows, plus the hand-written "Tell us" links on each page, the footer, the README and the MCP `how_to_report_a_problem` tool. Lines that said reports are public on GitHub now say the form needs no account and is not posted. Links for things we missed ("Know a group we missed?") also go to the form, since it takes add requests (`docs/operations/group-requests.md`). The GitHub issue templates stay for people who work on the project.
- **Shipped:** How this site works now says "the owner" and points to About for the name. Its checks table was fixed for 320px at 200% text in #1077, so this change leaves the table as #1077 made it.
- **Same day:** David added two hidden fields to the Tally form, `listing` and `page`. One helper, `fixFormUrl` in `site/src/lib/group-requests.mjs`, builds every link with them: "Report a problem" passes the listing's slug and the page path, and page "Tell us" links and the footer pass the page path. The MCP tool passes the listing id when it is given one.
- **Scoreboard:** no number moves. It speaks for the project, so it waits for David (for:david).
- **Cost:** $0.
