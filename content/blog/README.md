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
