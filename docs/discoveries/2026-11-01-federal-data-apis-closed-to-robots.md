# Two federal data APIs ask robots to stay out

- **Found:** 2026-11-01, auditing every automated read for robots.txt (#529)
- **What we found:**
  - `api.bls.gov`, the Bureau of Labor Statistics public data API, serves a `robots.txt` with `User-agent: *` and `Disallow: /`. So does `data.bls.gov`. `www.bls.gov` and `download.bls.gov` answer automated reads with an "Access Denied" page that says bot activity outside BLS usage policy is not allowed.
  - `api.weather.gov`, the National Weather Service API, also serves `Disallow: /` for every robot. The NWS forecast pages on `forecast.weather.gov` have no robots.txt, and their forecast JSON is readable.
- **Evidence:** each `robots.txt` above, read 2026-11-01.
- **Why it matters:** Both are documented public APIs, but their robots.txt files ask every robot to stay out, and we follow robots.txt. The monthly Monongalia County unemployment rate can no longer be refreshed automatically, so the site shows the last number it read with that date. The weather in the header moved to the forecast page's JSON.
- **Who keeps it:** U.S. Bureau of Labor Statistics; National Weather Service.
- **Status:** open
