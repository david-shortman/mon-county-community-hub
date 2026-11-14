# Research method: from a resident's question to checked facts

Every session researches a little differently. This page is the shared way to go from a question someone here would ask to facts we can put on the site. It answers #1096. It sits before the [source order](source-order.md) (which source to trust) and the [sourcing rule](trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced) (every fact on a page you read).

Cost: $0. Web search, public pages and the repo.

## The five steps

### 1. Start from the question, in the resident's words

Write the question the way a person here would say it, not in agency terms: "Where can I get help with my water bill?", not "utility assistance programs". [What people search for](what-people-search-for.md) lists the words residents use by topic. Write down the place (Morgantown, a town in the county, the whole county, the state) and who is asking (a renter, a parent, a business owner, a helper).

### 2. List who would own the answer

Before searching, list who would run, pay for or decide the thing. These are the tier 1 and 2 sources in the [source order](source-order.md).

| Ask | Examples |
|---|---|
| Which office runs it or makes the rule? | City of Morgantown, Monongalia County Commission, a state agency, the state code |
| Which local group does the work? | A pantry, a clinic, a legal aid office, a church program |
| Who pays for it? | United Way, a foundation, a state or federal grant program |
| Who sends people there? | 211, the library, a school counselor, a hospital social worker |

Then go to each owner's own site first, and use its own search or site map, before any general web search.

### 3. Broaden with set search patterns

When the owners' sites do not answer it, search with these patterns, in this order:

1. `site:<owner's site> <resident's words>`, for each owner on the list
2. `"Monongalia County" <program words>` and `"Morgantown" <program words>`, then the same with `WV`
3. The program's official name, once you know it, in quotes
4. Local names: the town (Westover, Star City, Granville, Cheat Lake, Blacksville), the neighborhood, local nicknames for places
5. `site:wv.gov <program words>` and `site:<county>.gov` for state and county pages
6. A filetype search for forms and rules: `<program> filetype:pdf site:<owner's site>`

A search result is never a source. It only points to a page you then open and read (step 5).

### 4. Keep ideas apart from facts

While searching you will find leads: a group that might help, a program that might exist, a news story that mentions a date. Write these down as **leads**, clearly marked as not checked, in the search log (below) or a Notion note. A lead never goes in a `content/` file or on the site. It becomes a fact only in step 5.

### 5. Fill in details only from sources that pass

For each fact (phone, hours, cost, who it is for, address, dates), open the page that states it and check its tier in the [source order](source-order.md). Write the fact only if that tier may support it. Add the source with its checked date and a quote ([proof of a re-read](reread-proof.md)). If no page that passes states the fact, leave it off and follow the rule for [unverified facts](../decisions/2026-10-30-0640-unverified-facts-get-an-issue.md): a `needs-verification` issue. If the public record itself has a hole, add a [discovery](../discoveries/).

## Keep a search log

For a new topic, or a listing that was hard to source, keep a short log of what you tried in [`docs/research/search-logs/`](../research/search-logs/), one file per topic or listing. It shows the next session where the dead ends are, so nobody repeats them, and it shows gaps in the public record.

Each row: the date, the search or the site you looked in, and what came of it (found, a lead, nothing, blocked). Never log anything about a private person, and never log a search that names one.

## Time limits

- Stop a search pattern after two pages of results with nothing relevant.
- If the owner's site blocks automated reads, a person reads it, or the fact stays off ([automated reads](../operations/automated-reads.md)). Never work around a block.
- If an hour of searching finds no page that passes, stop, open the `needs-verification` issue, and move on.

## Sources checked

The search patterns follow the lateral reading and "find better coverage" steps of the SIFT method ([hapgood.us/sift](https://hapgood.us/sift/), read November 14, 2026: "Find better coverage" and "Trace claims, quotes, and media back to the original context"). The rest are house rules linked above. Written November 14, 2026.
