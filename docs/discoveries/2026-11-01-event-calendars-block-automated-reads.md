# Several downtown and holiday event calendars block automated reads

- **Found:** 2026-11-01, while filling the November and December 2026 calendar (#529)
- **What we found:** The main places that list downtown Morgantown and holiday events answer automated reads with a block page, so their dates can't be checked or pulled in by a feed:
  - Main Street Morgantown's downtown events calendar (`business.morgantownpartnership.com/downtownevents` and `/calendar/`) shows a Cloudflare "Just a moment" challenge. The Partnership's public page (`morgantownpartnership.com/main-street-morgantown/events-downtown/`) describes Small Business Saturday and the December Downtown Dash but gives no 2026 dates, and its `robots.txt` disallows `/wp-json/`.
  - The Mountain Glow WV light walk site (`mountainglowwv.com`) and the Arts Council of Greater Morgantown's First Friday page (`artsgm.org/first-friday/`) return "Error 406 - Not Acceptable" (Mod Security), even for `robots.txt`.
  - Visit Mountaineer Country (`visitmountaineercountry.com`, including `/holiday-events/`) and WVU's event calendars return HTTP 403.
- **Evidence:** each address above, read 2026-11-01.
- **Why it matters:** Residents looking for the downtown tree lighting, holiday parade, Small Business Saturday or First Friday find dates mostly on these calendars. Because we never work around a block, those events stay off our calendar until a person checks them or an official page we can read posts the date.
- **Who keeps it:** Morgantown Area Partnership (Main Street Morgantown), Mountain Glow WV, Arts Council of Greater Morgantown, Mountaineer Country CVB, WVU.
- **Status:** open
