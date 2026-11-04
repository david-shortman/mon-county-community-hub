# 2026-11-04: Blog post checks and feeds (#1705, #1703)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - The rest of #1689 is all high-stakes pages, and the week 2 plan asks for fewer `for:david` items.
  - The explainer epic (#1440) is done.
  - #1412 and #204 wait on other work.
  - The blog's first post (#1709) needs these checks in place before it goes to the owner.
- **Chose:** both blog follow-ups in one PR. They are small, they finish the blog's setup (#1701), and the checks are a safety rule: a post that ages must never send someone to an old phone number, hour or amount.
- **Shipped:**
  - **Post checks:** `site/scripts/check-blog.mjs` runs in `check-content`, with the rules in `site/src/lib/blog-checks.mjs`. They stop a post that has:
    - a phone number, hours, a dollar amount or an income limit
    - 211, 988 or 911 outside a link to a help page
    - the owner's name, or an em dash
    - "now" or "currently" with no date in the sentence
    - a GitHub link asking readers to report a problem
    - a listed page or site link that does not exist
    
    A bad fixture post tests each rule on every run.
  - **Feeds:** `/blog/feed.xml` (RSS 2.0) and `/blog/feed.json` (JSON Feed 1.1), with full text and absolute links, newest first. They are written by hand, so the site needs no new package (cost: none). Both feeds are linked in every page's head, on `/blog/`, in `llms.txt` and in the `/api/v1/` catalog. Tests are in `site/test/blog.test.mjs`.
- **Checked:**
  - Built with the sample post (`BLOG_DIR=test/fixtures/blog`).
  - The RSS parses as XML, and the JSON Feed lists the post with its correction date as `date_modified`.
  - Reading grade, time words, contrast, weight and accessibility already scan every built page, so `/blog/` pages get them.
- **Scoreboard:** none yet. Feed reads are not counted. Once the first post is up, check in the November 16 retro whether the visit counter shows `/blog/` views.
