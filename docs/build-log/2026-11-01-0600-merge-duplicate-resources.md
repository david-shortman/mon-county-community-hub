# 2026-11-01: Merge two pairs of duplicate resources

- **Considered:** two sessions each added a record for the county health department's farmers market food permit, and two added the state's road repair request form. Each pair had the same link, phone and sources, so the same permit or form showed on different pages with different wording (#1170, #529).
- **Chose:** kept `monchd-farmers-market-vendor-permit` and `wvdoh-road-repair` (the record under the Division of Highways, which runs the form). Each keeps every source and gains the other's topics and the facts it lacked (the county limit, the District 4 hours, free). No fact values changed. Pages and the Grow guide now point at the kept records.
- **Left off:** the API files for the two removed slugs (`/api/v1/resources/monchd-farmers-market-permit.json`, `/api/v1/resources/wvdoh-road-repair-request.json`) go away; a JSON file cannot redirect.
- **Cost:** $0.
