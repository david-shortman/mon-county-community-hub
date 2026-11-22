# /selling-food/: city vending lines read from fact records

Date: 2026-11-14. Part of #122.

## What I considered

No `for:code` + `up-next` issue was open, and no self-merge PR was open. The street vending section of `/selling-food/` was the next step named on #122 after #1927. The city site had reset twice in the last run, but it answered this time.

## What shipped

- Four fact records in `content/facts/selling-food/`, each quoting the City of Morgantown "Vending Downtown" page, read 2026-11-14: the business license rule for trucks and carts, no permit on private property with the landowner's permission, the vending space maps, and who to call (Finance Department, 304-284-7423).
- The "Selling from a truck or cart in Morgantown" section renders those with `<Fact>`. The old typed paragraph and its October 30 SourceLine are gone.
- One wording fix: the old text said questions about "selling from a truck or cart" late at night. The city page says "selling food downtown," so the record now says that.

## Scoreboard

Moves the count of page lines that read from fact records (#122). Check on 2026-11-21 that the next freshness sweep shows these four as current.
