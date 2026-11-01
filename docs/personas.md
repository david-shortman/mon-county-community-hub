# Personas: who comes to the site, and where they should go

For #1036, sprint wave 9 (#529). Built from the persona table in the [findability plan](https://claude.ai/artifact/4oPAmBhc1xnZShBLMdhWhN), with one persona added for need 12 (chronic disease). Last reviewed 2026-11-01.

A persona is a person in a moment, not a profile. Each one is tied to a need in the [needs register](../content/needs/) or a life area, names its evidence (a needs register source, or a [resident group](groups/) research file), and lists the words they would search, the page search should land them on, and the next steps from there. Personas link to pages; they state no phones, dates or costs.

The data is in [`content/personas.yaml`](../content/personas.yaml). After every build, `site/scripts/check-personas.mjs` (#1042, #1308) checks that each landing page exists and each next step is one or two taps from it, counting only links in each page's main content. A broken path fails the build. Each persona also has at least one findability question in [`content/findability/questions.yaml`](../content/findability/questions.yaml), so the Sunday check covers them; q46 to q62 were added for this.

## The list

| Persona | Need or life area | Would search | Lands on | Next steps | Questions |
|---|---|---|---|---|---|
| Nowhere to sleep tonight | `homelessness` | where can I stay tonight morgantown | `/stay-tonight/` | `/help/food/` | q26 |
| In crisis, or scared for someone | `mental-health-care`, `drugs-and-overdose` | mental health help today morgantown | `/mental-health/` | `/drugs-and-alcohol/` | q06 |
| Shutoff notice on the power or water | `utility-bills` | help paying electric bill morgantown | `/utility-bills/` | `/money/` | q01, q03 |
| Behind on rent or got an eviction notice | `housing-costs` | eviction help morgantown wv | `/money/` | `/stay-tonight/`, `/legal-help/` | q25 |
| Short on food this week | `enough-food` | food pantry open today morgantown | `/help/food/` | `/snap/` | q02, q04 |
| Working, paycheck to paycheck, at tax season | `wages-and-cost-of-living` | free tax help morgantown | `/free-tax-help/` | `/money/` | q46 |
| No insurance, needs a doctor or medicine | `paying-for-health-care` | free clinic morgantown | `/dental-and-prescriptions/` | `/care/`, `/medical-rides/` | q05, q08 |
| Wants a flu or COVID shot | health | free flu shot morgantown | `/flu-shots/` | `/staying-well/` | q07 |
| Just told they have prediabetes or high blood pressure | `chronic-disease` | diabetes class morgantown wv | `/diabetes-and-weight/` | `/staying-well/`, `/staying-active/` | q47 |
| Turning 65 | `paying-for-health-care` | medicare help morgantown wv | `/turning-65/` | `/after-you-apply/medicare-savings/`, `/staying-well/` (not linked yet: `/bus-passes/`, `/staying-active/`) | q48 |
| Adult child caring for an aging parent | `transportation` | in home care for elderly parent wv | `/for/older-adults/` | `/medicaid-waivers/`, `/medical-rides/` | q29 |
| Person with a disability or a caregiver | `transportation` | disability help morgantown | `/for/disability-and-caregivers/` | `/disability-and-aging/`, `/help-at-home/` (not linked yet: `/bus-passes/`) | q49 |
| Pregnant or has a new baby | `child-care` | wic morgantown | `/for/parents-young-kids/` | `/families-and-kids/`, `/car-seat-checks/` | q50 |
| Parent of a school-age kid | `child-care` | enroll monongalia county schools | `/school-age/` | `/families-and-kids/` | q51 |
| Teen wanting a first job or a license | work | work permit 15 year old wv | `/teens/` | `/teen-drivers/`, `/find-a-job/` | q52 |
| WVU student who is short on money | `enough-food` | wvu food pantry | `/help/food/today/student/` | `/help/food/today/`, `/money/` (not linked yet: `/getting-around/`) | q53 |
| Just lost a job | `wages-and-cost-of-living` | file unemployment wv | `/find-a-job/` | `/work-and-learning/` | q54 |
| Home from jail or prison | `wages-and-cost-of-living` | jobs for felons morgantown | `/reentry/` | `/find-a-job/` | q55 |
| Starting a business or a trade | business | business license morgantown | `/business/` | `/contractor-license/`, `/work-and-learning/` (not linked yet: `/permits/`) | q09, q10 |
| Remote worker moving here | moving | moving to morgantown remote work | `/moving-here/` | `/internet/`, `/find-your-people/` | q56 |
| Just moved here | moving | morgantown trash pickup | `/for/new-to-mon-county/` | `/moving-here/`, `/recycling/`, `/vote/` | q19 |
| Renter with a repair or deposit problem | `housing-costs` | landlord won't fix morgantown | `/renting/` | `/legal-help/` | q57 |
| Rural homeowner | home | septic permit monongalia county | `/septic-and-wells/` | `/flood-zone/`, `/permits/` | q58 |
| After a storm, power out or flooding | safety | power outage morgantown | `/after-a-storm/` | `/weather-alerts/`, `/flood-zone/` | q59 |
| Reads another language best | language | interpreter morgantown | `/help-in-your-language/` | `/legal-help/` | q60 |
| Veteran looking for care or benefits | veterans | va clinic morgantown | `/veterans/` | `/find-a-job/` | q61 |
| Wants to help or give | giving | volunteer morgantown this weekend | `/volunteer/` | `/make-it-better/`, `/find-your-people/` (not linked yet: `/sell-or-donate/`) | q16, q18 |
| Wants a say in local decisions | civic | speak at city council morgantown | `/have-your-say/` | `/make-it-better/boards/`, `/meetings/agendas/` (not linked yet: `/vote/`) | q12, q13 |
| Lonely or new, looking for their people | `loneliness` | things to do in morgantown | `/find-your-people/` | `/community-centers/`, `/arts-and-making/`, `/meet-people/` (not linked yet: `/parks/`) | q43, q45 |
| Gardener or would-be grower | growing | soil test wv | `/soil-test/` | `/grow/` | q33 |
| Helper: librarian, pastor or case worker | helpers | morgantown resource list | `/make-a-list/` | `/partners/` | q62 |
| Curious long-time resident, just looking around | community data | what's going on in morgantown this week | `/pulse/` | `/how-we-are-doing/` | q24 |

## What the first check found

- Every landing page from the plan exists now, including the three the plan listed as gaps (`/mental-health/`, `/reentry/`, `/renting/`).
- Eight next steps from the plan are not one or two taps from their landing page yet. They are kept as `not_linked_yet` and tracked in #1338.
- All 12 needs in the register have at least one persona. Need 12 (chronic disease) had none in the plan, so "Just told they have prediabetes or high blood pressure" was added.

## Keeping it current

- When a page is renamed or a link is dropped, the build names the persona that broke. Fix the link, or update the persona.
- Review each persona every six months (`last_reviewed`); the check warns after that.
- A new need in the register gets a persona and a findability question in the same PR.
