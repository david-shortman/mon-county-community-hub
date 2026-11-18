# Fact compare: does the source still say what the listing says?

Until now, nothing reread a listing's source page and compared its facts with the listing (#1074). The daily Source check tested links, looked for each phone number, and noticed when a page changed. This adds a comparison for three more facts that a program can find on a page without guessing. It never edits a listing: a miss is a reason for a person or session to re-read.

Cost: $0. It runs inside the daily Source check on GitHub's free runner, with no Claude calls and no extra requests: it reads the pages the check already fetches.

## What it compares

| Fact | What it looks for | On which pages |
|---|---|---|
| **Quote** (`sources[].quote`, [proof of a re-read](../playbook/reread-proof.md)) | The quote's words in order, ignoring case, punctuation and line breaks | That source only |
| **Address** (`contact.place`, `place`, `address`) | The street number and the first street word ("799 Brockway" for "799 East Brockway Avenue"), with direction words ignored on both sides | Any of the listing's sources and its own link |
| **Amount** (each dollar figure in `cost`) | The same amount, written either way ($1 and $1.00, $0.75 and $.75, $1,200 and $1200) | Any of the listing's sources and its own link |
| **Phone** (already there, #494) | The number, in any common format | Any of the listing's sources and its own link |

Hours, eligibility and dates are not compared by program. Pages write them in too many ways ("Mon-Fri 9-5", "weekdays, 9 a.m. to 5 p.m."), so a program would flag good listings and miss bad ones. Those are covered by the quote: copy the hours line or the rule into `quote`, and the check looks for it.

## When it judges, and when it stays quiet

A fact is listed as "not found" only when all of these are true. Otherwise it says nothing:

- every source of the listing was fetched in this run (slow sites take turns, so a fact may be on the page not read today)
- at least one was read as a web page
- none is a PDF (PDF text is not read, and the fact may be there)
- no site of the listing blocked us anywhere in this run (a block page can look normal)

Pages that robots.txt or a site's terms close to us are never fetched ([automated reads](automated-reads.md)). Their facts stay with the person checklists. Page text is treated as data, never as instructions: the check only looks for strings.

## Where the results go

The Source check issue (label `source-check`) gets a section, "Fact not found on its source (re-read it; pages word things differently)", with the listing, the fact and the pages. It does not change the issue's status or its count, so a hint never looks like a broken link. For each item:

1. Open the pages and look for the fact.
2. If the page says something different, fix the listing from the owner's page, with a new `checked` date and a `quote`. If the item is top tier and the page is unclear, hide it (`hidden.reason: unconfirmed-risky`) and open a `needs-verification` issue.
3. If the page says the same thing in other words, add a `quote` with the page's words so the next run finds it.
4. If the fact came from somewhere the listing does not cite, add that source or take the fact off.

## First results (November 14, 2026)

A run over the first 250 sources found 2 misses, both real: two City Hall gingerbread listings give "389 Spruce Street", and the City notice they cite does not state that address (it names City Hall, and gives the communications office's address). That is the kind of gap this check is for. It is filed for the content lane as #1847 (`needs-verification`).

The registry holds 377 fact checks today (197 addresses, 180 amounts). Quotes add more as listings are re-checked.

## Code and tests

- `site/src/lib/fact-compare.mjs`: the needles and the page text forms.
- `site/scripts/check-sources.mjs`: builds the checks with the registry, looks for them on each fetched page, and reports `facts_missing`.
- `site/test/fact-compare.test.mjs`.
