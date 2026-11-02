# 2026-11-02: Reach count by Census place, not mailing town (#1412)

- **Considered:** the three gaps in #1412: food pantries missing, the DoHS office missing, and Morgantown mailing addresses hiding county places. Pantries have no listing records yet (#1413), and the DoHS record is high stakes (topics money and food), so its address waits for a PR David reviews.
- **Chose:** look up each address with the U.S. Census Bureau's free geocoder (no key, no robots.txt) and count it in the Census place it is in, the same rule the town pages use. Lookups are saved with their dates in `content/findability/reach-places.yaml`, so a normal run needs no network. A match on a different street (it returned Hawley Lane for Fawley Lane) is thrown out. Addresses it cannot place are counted by mailing town and listed.
- **Shipped:** `reach.py --geocode`, the lookups file, place and topic lines in the output, a note on the scorecard row, and a new row and notes on the scoreboard.
- **Result:** same 194 listings. Rest of the county: 61 (31%) by place, up from 31 (16%) by mailing town. 40 of the 61 are outside any town or named place. Of 155 Morgantown mailing addresses, 94 are in the city. Cheat Lake has 2, Brookhaven none.
- **Scoreboard:** the reach row's first move on the November 9 scorecard is the method change, not new listings.
