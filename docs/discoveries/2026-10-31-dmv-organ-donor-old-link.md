# The DMV's old organ donor page address leads to a "not found" page

- **Found:** 2026-10-31, while adding organ donor sign-up to `/ids-and-records/` (#1085)
- **What we found:** The old address for the DMV's organ donor page, https://transportation.wv.gov/DMV/Drivers/Pages/Organ-Donor-Registry.aspx, redirects to https://dmv.wv.gov/Drivers/Pages/Organ-Donor-Registry.aspx, which returns "not found". The current page is https://dmv.wv.gov/driver-services/drivers/organ-donor-registry. Search results still list the old address.
- **Evidence:** All three addresses were opened on 2026-10-31. The old one answered with a 301 redirect; the redirect target answered 404; the current page loaded.
- **Why it matters:** Someone following an older link or a search result to sign up as a donor lands on an error page.
- **Who keeps it:** West Virginia Division of Motor Vehicles
- **Status:** open
