# 2026-10-30: Bus directions on listings with an address

- **Considered:** #407 asks for the nearest Mountain Line stop, routes and the last bus back on each listing, worked out from the public schedule feed. The feed's published address could not be fetched today, and the newest saved copy anywhere is from February 2024. Schedules have changed since, so last-bus times from it could send someone to a bus that no longer runs.
- **Chose:** ship only what needs no schedule facts: a "Bus directions" link on any listing whose source publishes an address. It opens the phone's map app with transit directions, which uses the map app's own current schedules.
- **Shipped:** `BusLink.astro`, one line in the resource and place cards. Hidden on printouts.
- **Waits on a person:** asking Mountain Line for a current public schedule file is outreach, so it is with David on #407.
