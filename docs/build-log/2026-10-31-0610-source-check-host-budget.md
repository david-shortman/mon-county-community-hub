# 2026-10-31: Slow sites take turns in the Source check (#166 follow-up)

- **Problem:** #945 made the Source check honor robots.txt Crawl-delay. The city site asks for 10 seconds between requests and has about 138 of our sources, so it alone would take about 23 minutes. The job stops at 30.
- **Did:** each site now gets at most 8 minutes a run. Watched pantry pages and Help now pages always go. A slow site's other sources take turns, a different slice each day, so all of them are checked within a few days, and the ones skipped keep their last result. The report names the sites that took turns.
- **Cost:** $0. The run gets shorter, not longer.
