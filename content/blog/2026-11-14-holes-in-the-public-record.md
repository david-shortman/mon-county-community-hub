---
title: Holes in the public record
date: 2026-11-14
type: what-we-found
summary: Checking the same public pages every day turns up places where the record itself has gaps. Two official pages disagree, a page is gone, or public data can't answer the question it seems to answer. Here are three examples, and what the project does when it finds one.
pages: [/how-we-check/, /bus-routes/]
---
This site only repeats what a current public page says. So when the public record has a hole, the site has the same hole. The project keeps a log of these holes, one short file each, in a public folder called [discoveries](https://github.com/david-shortman/mon-county-community-hub/tree/main/docs/discoveries). It held 107 files on November 14, 2026.

The log describes what a page says or does not say. It does not guess why. Here are three examples.

## Two pages, two numbers

On November 1, 2026, Mountain Line's home page said it runs 22 bus routes. Its route list page said 24 ([discovery file](https://github.com/david-shortman/mon-county-community-hub/blob/main/docs/discoveries/2026-11-01-mountain-line-route-count.md)).

It is a small thing. But a rider, or anyone describing the bus system, can't tell which number is current. When two official pages disagree like this, the site does not pick one. It says who says what, or leaves the detail off.

## A page that is gone

On November 2, 2026, the City of Morgantown's Bicycle Board page returned "not found." The newest Bicycle Board agenda in the city's Agenda Center was from September 2018. The board was not on the city's lists of boards. But another city board's page still listed a Bicycle Board seat, and a trail group still linked to the old page ([discovery file](https://github.com/david-shortman/mon-county-community-hub/blob/main/docs/discoveries/2026-11-02-bicycle-board-page-gone.md)).

So a person looking for the board's meetings finds dead ends. The public pages do not say whether the board still meets. The site does not say either way.

## Data that can't answer the question

Morgantown's 311 requests are public data. A job that reads them ran on October 31, 2026. Of 931 requests opened over the year before, 757 were marked "archived" and 10 were marked "closed" ([discovery file](https://github.com/david-shortman/mon-county-community-hub/blob/main/docs/discoveries/2026-10-31-311-archived-not-closed.md)).

The data does not say whether "archived" means fixed. So it can't show how fast requests get handled. A count of days to close, based on 10 requests, says little.

## What happens next

When a needed fact is not on a current official page, three things happen:

1. **It stays off the site.** The site does not fill the gap with a guess, an old page or memory.
2. **An issue is opened.** A public issue, labeled `needs-verification`, records the last known facts, the sources that disagree, and what a person would need to ask. That rule is in a [decision from October 30, 2026](https://github.com/david-shortman/mon-county-community-hub/blob/main/docs/decisions/2026-10-30-0640-unverified-facts-get-an-issue.md).
3. **The hole is logged.** If the problem is in the public record itself, it gets a discovery file. When it is fixed, the file stays and is marked fixed, with the date.

The AI never contacts the office or group that keeps the page. Whether and how to share the list is up to the owner.

[How we check](/how-we-check/) explains the rest of the checking, including what it does not do.
