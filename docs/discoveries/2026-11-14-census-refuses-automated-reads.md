# Census data for the county cannot be read by a program that follows robots.txt

- **Found:** 2026-11-14, while looking for newer American Community Survey numbers for the needs register (#988, sprint wave 17, #529)
- **What we found:** The Census Bureau's data API answered a request for its robots.txt with a "Request Rejected" page, not a robots.txt file. QuickFacts, the Census page that sums up a county in one table, answered 403 to an automated read. So the newest Census survey numbers for Monongalia County (poverty, rent burden, income) cannot be read on a schedule by a program that follows [our rule for automated reads](../operations/automated-reads.md). A person can still look them up on data.census.gov.
- **Evidence:** https://api.census.gov/robots.txt and https://www.census.gov/quickfacts/fact/table/monongaliacountywestvirginia/PST045224, both read 2026-11-14.
- **Why it matters:** Census survey numbers are the base for many local reports. Without a readable source, tools like ours can only use the Census numbers that others republish (County Health Rankings, the hospital needs assessments), which are often a year or more behind.
- **Who keeps it:** US Census Bureau
- **Status:** open
