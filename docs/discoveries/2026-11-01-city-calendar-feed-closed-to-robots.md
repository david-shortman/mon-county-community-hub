# The City of Morgantown calendar feed is closed to robots

- **Found:** 2026-11-01, auditing every automated read for robots.txt (#529)
- **What we found:** On 2026-10-21 the city's `robots.txt` added `Disallow: /common/modules/icalendar/`. The city's iCalendar feeds (listed at `www.morgantownwv.gov/iCalendar.aspx`) live at `/common/modules/iCalendar/iCalendar.aspx`, the same address with different capital letters, on a server that treats both the same. So the feed the site used to fill the calendar with city events is now one robots are asked not to read. The same file asks a named list of AI crawlers to stay out of `/calendar.aspx` and `/CivicAlerts.aspx`.
- **Evidence:** `https://www.morgantownwv.gov/robots.txt`, read 2026-11-01 (the rule is marked "added 2026-10-21 by Add-RobotsRules").
- **Why it matters:** City events (parks, holiday events, public programs) reached the site's calendar automatically through this feed. Now the site keeps only the events it saved before, which drop off as their dates pass, and a person adds new ones from `calendar.aspx` on the weekly centers checklist.
- **Who keeps it:** City of Morgantown.
- **Status:** open
