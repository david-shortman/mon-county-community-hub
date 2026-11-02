# Help in languages other than English

Last checked: 2026-11-01 (see "Re-checked 2026-11-01" below)
For issue #181.

About 1.8% of Mon County residents speak English less than very well. Spanish, Arabic and Chinese are among the most common other languages at home (ACS 2020 to 2024, table C16001, see `docs/design/presentation.md`). This note lists which groups say, on their own pages, that they help people in other languages.

## Groups that state language help

| Group | What its page says | Cost | Entry | Source |
|---|---|---|---|---|
| WVU Medicine (Ruby Memorial, Golisano Children's) | Qualified interpreters and information written in other languages; sign language interpreting. Ask any staff member, or call 304-598-6100 ahead of time. | Free | `wvu-medicine-language-services` | [language services](https://wvumedicine.org/patient-resources/language-services/) |
| WV state courts | Interpreters for anyone with limited English in a civil, criminal or family case, "regardless of ability to pay." Ask at the clerk's office for the request form. Family and friends cannot interpret in court. | Free | `wv-court-interpreters` | [access to justice](https://www.courtswv.gov/public-resources/accessibility-information/access-justice) |
| Mountain State Justice | Website pages in Spanish and Arabic. Free legal help, including immigration cases, for West Virginians with low income. | Free | `msj-immigration-legal-help` | [get help](https://mountainstatejustice.org/get-help/) |
| Catholic Charities West Virginia | Refugee resettlement and low-cost immigration legal services, listed for Monongalia County. | Low cost | `ccwva-immigration-services` | [program page](https://www.ccwva.org/programs/west-virginia-immigration-refugee-resettlement-services/) |
| MTEC adult education | English classes for adults (already listed). | Ask when you call | `mtec-adult-education-esl` | [state class list](https://wvde.us/academics/adult-education/wvadulted-class-locations) |

## Checked, nothing stated

- **WV 211** home page: no mention of languages or interpreters (checked 2026-10-30).
- **Legal Aid of West Virginia:** the apply page our entry cites returned "404 Not Found" on 2026-10-30, so its language help could not be checked. Its entry's source link needs a re-check.

Checked 2026-10-30 (second pass):

- **Monongalia County Health Department:** its [accessibility page](https://www.monchd.org/accessibility) says it offers "qualified interpreters, sign language, readers and translators" for people "who speak a language other than English." Entry: `monchd-language-help`.
- **WV DoHS:** the home page says nothing. Its [nondiscrimination page](https://dohs.wv.gov/nondiscrimination-policies-and-plans) links a June 2023 WVDHHR Limited English Proficiency plan: Spanish help from bilingual staff, third-party interpreters "when appropriate", and offices to be given language flashcards. A plan, not a promise for every office, so the site says "the plan says."
- **Milan Puskar Health Right, Monongalia County Schools, Morgantown Public Library:** their home pages say nothing about interpreters or languages. Not confirmed; the site says to ask.

## Recommendation for the site

1. **Done (2026-10-30): `/help-in-your-language/` page.** Originally: add a "Help in your language" section on the Family and life changes door, which already lists language help in its hint. Show the groups above, each in its own words. Cost: free.
2. **On health and legal pages, add one plain line:** "You can ask for a free interpreter." Only where the provider's own page says so (WVU Medicine, state courts). Cost: free.
3. **Do not machine-translate the site yet.** A wrong translation of a phone number, date or rule could send someone to the wrong place. Point to people who speak the language instead.
4. **Record languages on entries** as groups state them, so pages can filter by language (#177 adds a languages field for places to go).

## Gaps and open questions

- Which state benefit offices in Morgantown offer interpreters, and how to ask.
- Whether WV 211 call takers use a language line. Its home page does not say.

## Re-checked 2026-11-01

Every fact below is from the organization's own page or a government page, read on 2026-11-01 after checking that the site's robots.txt allows it. Quotes are the page's own words.

### State benefits (WV DoHS: SNAP, Medicaid and other help)

- **The caseworkers' rulebook.** The Income Maintenance Manual ("Effective 10-05-2026", [chapter 1 PDF](https://bfa.wv.gov/media/40005/download?inline)), section 1.2.1.E, says: "If an individual requires an interpreter, the Worker must contact local resources to locate one." If none is found, the supervisor contacts the DFA Policy Unit. Limited English can be a "reasonable accommodation" request, recorded on form DFA-ADARA-1. The line "Public entities are prohibited from charging a fee for auxiliary aids and services" sits under the disability heading, so it does not clearly say spoken-language interpreters are free.
- **SNAP page:** "program information may be made available in languages other than English" ([bfa.wv.gov/snap](https://bfa.wv.gov/snap)).
- **Nondiscrimination notice:** the [nondiscrimination page](https://dohs.wv.gov/nondiscrimination-policies-and-plans) links the notice in English and in Spanish. The [English notice](https://dohs.wv.gov/media/11715/download?inline) says people with limited English "may be entitled to accommodations" such as translation, and names a Non-Discrimination Coordinator: OSAcivilrights@wv.gov, 304-558-0026. The notice's wording refers to "EPA assistance", which looks copied from another agency's template.
- **Language access plan** (June 12, 2023, [PDF](https://dohs.wv.gov/media/11712/download?inline)): "Written Spanish translation or interpretation services from WVDHHR bilingual staff are available," and outside services are used "when appropriate." Offices are "intended" to get flashcards in Spanish, Vietnamese, French, German and Persian. The plan does not name SNAP, Medicaid or WIC and does not say "free." It also mentions "Training of DEP Staff", another sign of a copied template.
- **Could not read:** WIC pages on wvdh.wv.gov (the server did not answer), and the WV PATH help page (it loads by script, so a plain read gets no text).

### Hospitals

- **WVU Medicine:** its [nondiscrimination page](https://wvumedicine.org/patient-resources/rights-and-privacy/non-discrimination/) says "Free language services to people whose primary language is not English, such as: Qualified language interpreting service, Information written in other languages," and to "notify any staff member." The [language services page](https://wvumedicine.org/patient-resources/language-services/) now shows only "Request a Translator" and the numbers 304-598-6100 or 800-982-6277 for Ruby Memorial and Golisano Children's. It no longer says "free" itself. Our entry already cites both pages.
- **Mon Health Medical Center (Vandalia Health):** its [nondiscrimination page](https://www.monhealth.com/main/nondiscrimination) says it "Provides free language services to people whose primary language is not English, such as: Qualified interpreters, Information written in other languages. If you need these services, contact the nurse. Patient Advocate Number: 304-598-1372." Its [patient rights page](https://www.monhealth.com/main/patient-rights-and-responsibilities) says patients "shall have access, where possible, to an interpreter." **Not yet on the site.**

### Courts

- The state courts' [access to justice page](https://www.courtswv.gov/public-resources/accessibility-information/access-justice) still says people with limited English "have a right to an interpreter when in court," that "Interpreter services are provided at the Court's expense, regardless of a user's ability to pay," and that family and friends cannot interpret. Ask at the county clerk's office for the request form; not using the form "does not dismiss the right." Questions: 304-558-0145. Matches our entry.
- The [Monongalia County court page](https://www.courtswv.gov/public-resources/court-information-county/monongalia_county) says nothing about language.

### Schools

- **Monongalia County Schools:** the [home page](https://boe.mono.k12.wv.us/) says "53 Native Languages Spoken" and has a "Translate" menu. We found no published English learner page; the site's Federal Programs page loads by script and gave no text. Interpreters for parents: not stated.
- **WV Department of Education:** the [Title III page](https://wvde.us/student-support-wellness/esea-programs/esea-title-iii) describes support for English learners and points to state Policy 2417. It says nothing about interpreters for parents. We could not read Policy 2417: the link goes to a site whose robots.txt says no, and the Secretary of State's copy is a scanned PDF with no text.

### Learning English

- **Literacy Volunteers of Monongalia and Preston Counties** ([lvmpc.org](https://lvmpc.org/)): "Hablamos Español." "Services are available to native English speakers and English language learners." "Instruction is free, confidential." "English language learner support": "3 Zoom classes taught a week by a certified English teacher." To sign up: call or text 724-491-2007, or email director@lvmpc.org. **Not yet a listing on the site.**
- **MTEC:** the state's [class list](https://wvde.us/academics/adult-education/wvadulted-class-locations) lists "MTEC Adult Education and ESL, 1000 Mississippi Street, Morgantown," 304-291-9226. Neither it nor [MTEC's site](https://mtec.mono.k12.wv.us/) states a cost for ESL. (Our entry's "Free" comes from the state's adult education page, which says services are at no cost to adult learners.)

### Crisis line

- **988 Lifeline** ([Spanish services page](https://988lifeline.org/interpretation-services/servicios-en-espanol/)): "ofrece servicios gratuitos en español las 24 horas del día" (free services in Spanish, 24 hours a day). "No tiene que hablar inglés" (you do not have to speak English). To call: "marque 988 y presione 2" (dial 988 and press 2). To text: send the word "AYUDA" to 988. The [FAQ](https://988lifeline.org/faq/) also says to press 2 for Spanish. The [interpretation services page](https://988lifeline.org/interpretation-services/) links pages in Tagalog, French, Russian and Chinese. The "over 200 languages" claim from news reports was not on any 988 page we opened, so it stays off the site. (Earlier the same day, a scripted read of 988lifeline.org got HTTP 403; later reads loaded, and robots.txt allows these pages.)

### Checked, nothing stated

- **WV 211:** [home page](https://wv211.org/) and [what we do](https://wv211.org/what-we-do): nothing about languages, interpreters or a language line.
- **Morgantown Public Library:** [mympls.org](https://mympls.org/), its services page and FAQ: nothing about interpreters or languages.
- **Milan Puskar Health Right** ([mphealthright.org](https://mphealthright.org/), services page): nothing about interpreters. (Note: healthright.org is a different group.)

### Recommendation (2026-11-01)

1. **Add two listings, then show them on `/help-in-your-language/`:** Mon Health Medical Center's free language services (contact the nurse; patient advocate 304-598-1372), and Literacy Volunteers' free English classes ("Hablamos Español"). Both are stated on the groups' own pages. That page is in the open Spanish PR (#1309), so this waits until that PR is settled.
2. **Add the 988 Spanish line where 988 appears in Spanish** (the Spanish crisis strip and later Spanish pages): "dial 988 and press 2", "text AYUDA to 988". It is crisis text, so it waits for David. Tracked on #1303. Official Spanish pages for SNAP, WIC and Medicaid are still unconfirmed there.
3. **Keep saying "ask for an interpreter" for state benefit offices,** with the wording "the plan says" or "the manual says." Neither page says interpreters are free for spoken languages, so the site should not promise it.
4. **Leave schools, 211, the library and Health Right as "ask when you call"** until a person confirms (issues below).

### Gaps (need a person)

Each is a `needs-verification` issue:

- Whether DoHS interpreters for SNAP and Medicaid are free, and how to ask at the Monongalia County office; what the WV PATH "Language Support" link says; WIC language help (#1323).
- Monongalia County Schools: the English learner program and interpreters for parents; what Policy 2417 says about parents (#1324).
- Whether WV 211 call takers use a language line; whether the library and Health Right offer interpreters (#1325).
- MTEC ESL schedule and any cost (#1325).
- The manual lists "Refugee Resettlement and Immigration Services, 827 Fairmont Road, Suite 203, Morgantown, (304) 343-1036" as an interpreter resource for refugee program participants. Whether that office is open now is unknown (see `docs/plans/2026-10-31-languages.md` on resettlement).
