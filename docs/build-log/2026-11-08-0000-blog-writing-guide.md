# 2026-11-07: A writing guide for blog posts (#1706)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - #122's next pages are `/have-your-say/` (a bigger refactor) and `/holidays/`. `/holidays/` has dated food items, which wait for the owner.
  - The blog (#1701) has its pages and feeds, but no guide for whoever drafts a post, including the Chronicle job's weekly notes.
- **Chose:** #1706. It is docs only, finishes the blog's setup apart from the checks in #1726, and lets the first post (#1709) and weekly notes be drafted the same way each time.
- **Shipped:** `docs/blog/README.md`. It covers:
  - the five kinds of post, and what goes in each
  - where facts come from (the public record only, every claim linked)
  - voice
  - people and organizations ("the owner", no private individuals, describe and never blame)
  - neutrality
  - tying numbers to dates
  - linking pages instead of copying phone numbers, hours, amounts or deadlines
  - corrections
  - how to propose a post
  - a short checklist before opening the PR
  
  It points to `content/blog/README.md` for the file format, and notes that the automatic checks are in #1726.
- **Scoreboard:** none directly. It supports the six-month goal of a public log strong enough that a reporter could tell the story from it. Check whether the first week notes post follows it.
