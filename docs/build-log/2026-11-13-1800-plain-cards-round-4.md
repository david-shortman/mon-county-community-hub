# 2026-11-13: Plainer "Who it's for" lines on 13 more cards (#1660)

- **Considered:**
  - No `for:code` issue was `up-next`, and no new issues or agenda guides came in.
  - #1660 still had 72 low-stakes cards whose "Who it's for" opening reads above grade 9.
- **Chose:** 13 more of those cards. Left out on purpose:
  - voting rules (voter ID, voter registration)
  - Medicaid 2027
  - domestic violence court advocacy
  - hospital financial help and child support payments
  - a card built around a direct quote
  - cards where required terms leave little room, like WVPTI and Special Olympics
- **Shipped:** new `who_it_is_for` wording on 13 cards. Wording only: every fact, number, name, place and link stays the same. A script checked that no other field changed. Long sentences are split.
  - Terms that decide who qualifies stay exactly as the source says them, like "community organizations", "assisted living residence" and "non-citizens who can get federal student aid". Last round's review showed that plainer swaps can narrow who a card is for.
- **Measured:** the average grade for these 13 openings went from 10.8 to 8.3. 7 are now at grade 9 or below.
- **Next:** about 59 low-stakes cards are still above grade 9, most near grade 10. The high-stakes ones go in a `for:david` batch.
- **Scoreboard:** the reading grade in the weekly scorecard. Check at the November 16 retro.
- **Cost:** $0.

## Before and after

| Card | Before | After |
|---|---|---|
| `ced-family-resource-specialists` | Families anywhere in West Virginia who have a child with a disability or special health care needs. The Family Resource Specialists are parents of children with disabilities. | Families anywhere in West Virginia with a child who has a disability or special health care needs. The Family Resource Specialists are parents of children with disabilities too. |
| `ohflac-facility-complaints` | Anyone worried about the care or conditions at a health care facility in West Virginia. That includes a nursing home, an assisted living residence or a residential care community. | Anyone worried about the care or conditions at a health care facility in West Virginia, like a nursing home. It also covers an assisted living residence or a residential care community. |
| `united-way-volunteer-opportunities` | People, businesses, students and groups. United Way says community members find its openings on GivePulse, a volunteer sign-up website. | People, businesses, students and groups. United Way says people find its openings on GivePulse, a website where you sign up to volunteer. |
| `usda-fsa-white-hall-service-center` | Farmers in Monongalia County. USDA's locator lists the Marion County Farm Service Agency, at the White Hall Service Center, as the FSA office for Monongalia County. | Farmers in Mon County. USDA's office finder lists the Marion County Farm Service Agency as the FSA office for Mon County. It is at the White Hall Service Center. |
| `usda-nrcs-morgantown-service-center` | Farmers and landowners in Monongalia County. USDA's locator lists this NRCS field office for Monongalia County. | Farmers and landowners in Mon County. USDA's office finder lists this NRCS field office for Mon County. |
| `wv-child-care-provider-search` | Families looking for child care in West Virginia. The state's search lists child care centers, family child care facilities, Head Start, out-of-school-time child care centers, registered family child care, and relative child care. | Families looking for child care in West Virginia. The state's search lists many kinds of care. They include child care centers, family child care facilities, Head Start, out-of-school-time child care centers, registered family child care, and relative child care. |
| `wv-dmv-lost-plate-or-decal` | Owners whose West Virginia license plate, registration card or registration decal was lost or stolen. | Owners who lost a West Virginia license plate, registration card or registration decal, or had one stolen. |
| `wv-dmv-registration-renewal` | Owners of a car, truck, motorcycle, trailer or RV registered in West Virginia. The DMV mails a reminder about 30 days before your registration runs out, but it says knowing when your plates expire is your job, and the reminder may not reach you if your address is out of date. | Owners of a car, truck, motorcycle, trailer or RV registered in West Virginia. The DMV mails a reminder about 30 days before your registration runs out. But it says knowing when your plates expire is your job. The reminder may not reach you if your address is out of date. |
| `wv-invests-grant` | U.S. citizens, and non-citizens who can get federal student aid, who have lived in West Virginia for at least one year before applying and want a certificate or two-year degree in a high-demand field at a West Virginia public college. | People who want a certificate or two-year degree in a high-demand field at a West Virginia public college. You must be a U.S. citizen, or a non-citizen who can get federal student aid. You must also have lived in West Virginia for at least one year before applying. |
| `wv-jumpstart-savings` | People in the skilled trades, including registered apprentices and journeymen. Also students and graduates of a community and technical college or a career and technical education program. | People in the skilled trades, including registered apprentices and journeymen. It is also for students and graduates of a community and technical college, or of a career and technical education program. |
| `wv-sos-charity-search` | Anyone who wants to check whether a group that asks for donations is registered with the West Virginia Secretary of State. | Anyone who wants to check if a group that asks for donations is registered with the state. The West Virginia Secretary of State keeps the list. |
| `wv-vehicle-inspection` | Every vehicle registered in West Virginia. The DMV says a safety inspection is required every 24 months. | Every vehicle registered in West Virginia. The DMV says each one needs a safety inspection every 24 months. |
| `wvu-extension-monongalia-garden-help` | Gardeners and growers in Monongalia County. | Gardeners and growers in Mon County. |
