# Search logs

What sessions tried while looking for sources, one file per topic or listing, so the next session can skip the dead ends and see where the public record has gaps. The method is in [the research method](../../playbook/research-method.md) (#1096).

## When to add one

- When you start a new topic.
- When a listing took more than a few searches to source, or could not be sourced.

Add to the file for that topic if one exists (at the end), or start a new one. Name it `<topic-or-listing>.md`, like `water-bill-help.md`.

## Shape

```markdown
# Water bill help

Question: "Where can I get help with my water bill?" (renter, Morgantown)
Owners listed: the water utility, the public service districts, United Way, 211

| Date | Searched or looked in | Result |
|---|---|---|
| YYYY-MM-DD | the utility's site search for "assistance" | found: its assistance page (now a source on the listing) |
| YYYY-MM-DD | `"Monongalia County" water bill assistance` | lead: a program named in a news story, not checked |
| YYYY-MM-DD | the funder's bills page | nothing for water |
```

This example shows the shape only. It is not a real search.

Result is one of: **found** (a source that passes the [source order](../../playbook/source-order.md)), **lead** (not checked, never on the site), **nothing**, or **blocked** (robots.txt or the site refused; a person reads it, or it stays off).

## Never

- Anything about a private person, or a search that names one.
- Facts for the site. A log holds leads and dead ends; facts go in `content/` with their sources.
