# /business-by-town/: Westover contact and forms lines read from fact records

Date: 2026-11-15 (UTC). Part of #122.

## What I considered

No `for:code` + `up-next` issue was open, and no self-merge PR was open. I listed pages that still type their sources and have no fact records. Most of the oldest are high-stakes (money, health, housing, voting). `/business-by-town/` (small business, last checked October 30) was the oldest that is safe to self-merge.

## What I chose and why

The Westover card is the only typed part of the page. Star City, Granville and the county are resource cards already. The card's fee, rate and due-date sentence comes from two PDF forms and is about tax, which waits for David, so it stays typed with its own source line.

## What shipped

- Five fact records in `content/facts/business-by-town/`, each quoting the City of Westover New Businesses page, read 2026-11-14 (Eastern): the call to get started and the New Business Packet, the four business forms, the contractor, building permit and occupancy forms, the paperwork email, and the city office address.
- The Westover card shows those with `<Fact>`. The fee sentence keeps its source line, now limited to the two PDFs.
- Small fix: "The page itself does not list fees" now says "The New Businesses page itself", since the sentence no longer follows the forms list directly.

## Scoreboard

Moves the count of page lines that read from fact records (#122). Check on 2026-11-21 that the freshness sweep lists these five as current.
