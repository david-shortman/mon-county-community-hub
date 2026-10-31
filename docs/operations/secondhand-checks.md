# Keeping the thrift, markets and swaps pages fresh

Secondhand listings go stale fast. Shops open, move and close, and most sales and markets post their dates only a few weeks ahead. This is the recurring check for the pages in #422: `/markets/`, `/thrift-shops/`, `/sell-or-donate/` and `/borrow-or-get-free/` (#430).

It costs nothing: it uses the free public pages below and scripts in this repo. Nobody contacts a shop, organizer or group.

## Weekly: new sale and market dates

Once a week, read each page below and add any new confirmed date to `content/calendar/` with the topic `secondhand` (used goods) or `market` (handmade and vendor markets), within a day of finding it. Follow the calendar rules in `content/README.md`: never guess a date, and leave out an event until its organizer or a dated listing gives one clear date.

| Source | What to look for |
|---|---|
| [Moonlight Market](https://www.wvmoonlightmarket.com/) | Night market dates, vendor applications |
| [Gallery 304 and WV Vintage Fest](https://www.visitmountaineercountry.com/?p=334848) | Vintage Fest and night market dates |
| [Mon River Trails Conservancy Handmade Market](https://montrails.org/mrtc-handmade-market) | Spring market date |
| [Mountaineer Week](https://mountaineerweek.wvu.edu/) | Arts and Craft Fair dates in November |
| [Morgantown Farmers Market](https://morgantownfarmersmarket.org/markets.html) | Season start and end dates, winter market dates |
| [Friends of the Morgantown Public Library](https://www.mympls.org/get-involved/friends/) | Book sale room hours and special sales |
| [Dominion Post events column](https://www.dominionpost.com/) | Rummage sales, church sales, craft fairs |
| [Visit Mountaineer Country events](https://www.visitmountaineercountry.com/events/) | Craft shows, markets, vintage events |
| [WVU calendar](https://cal.wvu.edu/) | Blue and Gold Mine Sale, campus markets |
| [Treasure Hunter card shows](https://www.treasurehunter.show/shows/west-virginia) | Card and collectible shows at Morgantown Mall and Mylan Park |
| [FestivalNet, Morgantown](https://festivalnet.com/fairs-festivals/West-Virginia/Morgantown-WV) | Mylan Park craft shows |

Eloquence Antiques and Artisans posts its Vintage Market dates mostly on Facebook, which a robot cannot read. Add those dates only when a readable page lists them.

## Every 3 months: re-check each shop and program

Run this in `site/`:

```
npm run secondhand-due
```

It lists every entry in `content/secondhand/` whose oldest source was checked more than 3 months ago, plus every `unclear` entry. For each one:

1. Re-read every source listed. Change `checked` only after you have read the page.
2. Update hours, address and what it takes if they changed. If the place closed, set `status: closed` and add a correction file in `content/corrections/`.
3. If sources now disagree, or a page is gone, set `status: unclear`. The entry drops off the site. Open a `needs-verification` issue with what each source says.

Cards show "Not checked lately" once a card's oldest check is over 4 months old, so running this every 3 months keeps that note off the site.

## Who runs it

Duet runs both checks (see the `for:duet` issue linked from #430). Claude Code sessions can run them too. When the page watcher (#122) is built, add the weekly sources above to it, so a change opens a PR on its own.
