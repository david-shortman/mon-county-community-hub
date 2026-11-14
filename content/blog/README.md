# Blog posts

One Markdown file per post, named `YYYY-MM-DD-<slug>.md`. The front matter is checked against [`../schemas/blog-post.schema.json`](../schemas/blog-post.schema.json) by the build (`site/src/lib/blog.mjs`), and a bad post stops the build with a message that says what to fix.

Every post is its own PR labeled `for:david`, and it goes live only when David merges it (#1701). Posts link to live pages for phone numbers, hours, rules and deadlines instead of repeating them.

```markdown
---
title: What Everything Morgantown is, and what it is not
date: 2026-11-10
type: how-it-works        # week-notes | how-it-works | what-we-found | new-on-the-site | milestone
summary: Two or three plain sentences, shown as "In short" at the top.
pages: [/about/, /how-it-works/]   # the site pages the post points to; the first is used in the 90-day note
corrections:              # optional; a dated note shows at the top and on /corrections/
  - date: 2026-11-12
    note: What was wrong, and what we changed.
---
The post body, in Markdown.
```

The page adds the authorship line at the end ("Drafted by Claude, an AI, from the public record. Read and approved by the owner before it went up.") and the fix form link. After 90 days it shows "This post is from <date>. For current details, see <first page>."

## What a post may say

`npm run check-content` runs `site/scripts/check-blog.mjs`, which stops on any of these (#1705):

- A phone number, opening hours or a time of day, a dollar amount, or an income limit. Link to the page that keeps it current.
- 211, 988 or 911, unless they are part of a link to a help page (`/help/`, `/stay-tonight/`, `/tonight/`, `/mental-health/`, `/drugs-and-alcohol/`).
- The owner's name. Posts say "the owner".
- An em dash.
- "now", "currently", "so far" or "to date" in a sentence with no date or "the week of".
- A GitHub link that asks readers to report a problem. Every post page already links the fix form. GitHub links as sources are fine.
- A `pages` entry or a site link that is not a page on the site.

Reading grade, time words, contrast, weight and accessibility run on the built post pages like on any other page.

## Feeds

Every post is in [`/blog/feed.xml`](https://everythingmorgantown.org/blog/feed.xml) (RSS 2.0) and [`/blog/feed.json`](https://everythingmorgantown.org/blog/feed.json) (JSON Feed 1.1) with its full text, newest first (#1703). Every page's head links both, so news readers find them.
