# Volunteer-ask sources in Mon County

Research for #952, for the "Ways to help" part of the community pulse (`docs/plans/2026-10-31-community-pulse.md`, `/pulse/`). Question: where do local groups post volunteer needs in a form the site could read, under their terms? All checked October 31, 2026. Nobody was contacted and no accounts were made.

**Short answer:** only one local source has a public feed today, and it is empty right now. The biggest shared list of dated volunteer shifts (WVU iServe) has no feed and no stated reuse terms. The national platforms forbid copying or automated reading. So for now the site should **link** to the big lists, keep **standing asks as records**, and read the one feed we can.

## Already in the repo

- United Way of Monongalia and Preston Counties and Volunteer West Virginia are in `content/orgs/`.
- `docs/groups/helpers.md` and `docs/research/belonging-and-connection.md` (section 3) already note that United Way uses GivePulse and WVU uses iServe, and recommend linking both.
- `site/src/pages/make-it-better/boards.astro` shows open city board seats, copied by hand (#676).
- The build reads seven calendar feeds (`site/src/lib/feeds/adapters/`). None are volunteer feeds.

## Sources

| Source | What it posts | Format | Reuse terms | Status |
|---|---|---|---|---|
| WVU iServe, https://iserve.wvu.edu/need/ | Dated shifts from WVU and community groups; 27 for November 2026 | HTML only (Galaxy Digital "Get Connected") | The "Terms and Conditions" link opens only a privacy policy; nothing on reuse | Opened. Link it. Reading it would need permission |
| United Way, https://www.unitedwaympc.org/volunteer-opportunities | Points community members to GivePulse, WVU people to iServe | HTML; GivePulse blocked our reader | GivePulse terms could not be read | United Way page opened; GivePulse blocked. Link it |
| Volunteer West Virginia, https://volunteer.wv.gov/ | Statewide search by ZIP code | Filled in by a script from an undocumented state service | WV.gov legal notices give no reuse license (https://www.wv.gov/policies/legal-notices) | Opened; listings not read. Link it |
| City of Morgantown, https://www.morgantownwv.gov/210/Volunteer-Opportunities | Open board and commission seats (14 today), "Open until filled" | HTML | Public city page | Opened. Already used by hand |
| Monongalia County boards, https://www.monongaliacounty.gov/authorities,_boards_and_commissions/index.php | A standing invitation to apply; no vacancy list | HTML | Public county page | Opened |
| Friends of Deckers Creek, https://deckerscreek.org/volunteer/ | Standing asks (Wednesday garden help, water sampling) and cleanup events | **iCal feed**: https://deckerscreek.org/events.ics (empty today) | None found | Opened. The only readable feed |
| Morgantown Public Library, https://mympls.org/about/volunteer/ | Standing roles, one current ask; sends WVU students to iServe | HTML | None found | Opened |
| Christian Help, https://motownchristianhelp.com/volunteer/ | Standing roles, sign-up form | HTML | None found | Opened |
| Mon Valley Habitat for Humanity, https://monvalleyhfh.org/volunteer/ | Interest form; calendar empty | HTML | None found | Opened through a fetch tool |
| Mountaineer Food Bank, https://mountaineerfoodbank.org/volunteer/ | Sign-up form; warehouse is in Gassaway | HTML | None found | Opened |
| WVU Medicine Ruby Memorial, https://wvumedicine.org/locations/ruby-memorial-hospital/about/volunteer/ | Standing program with an application | HTML | None found | Opened |
| BOPARC, https://www.boparc.org/ | No volunteer page found | | | Opened |
| Main Street Morgantown | Nothing on volunteering | | | Opened |

**National platforms:** Idealist, which now runs VolunteerMatch, says users may not "scrape, copy, republish, license or sell the data or information on the Services" or use "any automated program... or 'bot'," and that its APIs and RSS need a separate agreement (https://www.idealist.org/en/terms-of-service, section 3(d) and 1(b)). JustServe's terms page did not load. volunteer.gov and AmeriCorps did not load for our reader. None of these should be read by the build. Linking to them is fine.

**Watch out:** iServe listings include partisan groups and student clubs logging internal hours. If any shared list is ever shown on the site, it needs a filter to stay neutral.

**Do not link:** bartletthouse.org now shows an unrelated gambling site. The shelter closed in 2024 (`docs/research/inactive-orgs.md`). The repo does not link it.

## Recommendation

Free, no key, no permission needed:

1. **Read the Deckers Creek iCal feed** with a feed adapter, so its cleanups show up on the calendar and the pulse when posted. The feed is empty today, so the page should say "nothing posted" when it is.
2. **Keep city board seats** as they are (copied by hand from the city page).
3. **Save standing asks as records** with a checked date: library roles, Christian Help, Ruby Memorial, Habitat, Deckers Creek's Wednesday gardening, and the county board invitation. Show them as "always welcome" on the pulse and on Make it better.
4. **Link** iServe, United Way's GivePulse page and Volunteer West Virginia's search, without copying their listings.

Anything beyond linking (reading iServe, GivePulse or the state search) would mean asking the group that runs it. That is David's call.

## Sources checked

All pages above were opened on October 31, 2026, except where the table says a page blocked our reader. Re-check by April 30, 2027.
