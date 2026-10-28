# Funder lens: Cities Deliver

What one major AI-for-cities funder looks for, and what it teaches us, whether or not we apply. Read October 28, 2026.

**The program:** Cities Deliver: AI Solutions for Public Services, from the Rockefeller Foundation and the OpenAI Foundation. $50 million in grants of $500,000 to $2 million to organizations working with city governments. ([announcement](https://www.rockefellerfoundation.org/news/rockefeller-openai-50-million-partnership-cities-improve-public-services-ai/), [program page](https://www.rockefellerfoundation.org/cities-deliver-ai-solutions-for-public-services/), [OpenAI Foundation post](https://openaifoundation.org/news/helping-cities-deliver-more-for-their-residents), [application site and documents](https://citiesdeliver.rockefellerfoundation.org/))

**Our fit:** probably not eligible this round. The program defines a city as 50,000 or more residents, and the City of Morgantown had 30,347 in the 2020 census ([Census QuickFacts](https://www.census.gov/quickfacts/fact/table/morgantowncitywestvirginia/INC110223)). See #42. The thinking below still applies.

## What they want to fund

Four focus areas, each aimed at underserved communities:

| Area | In their words | Examples they list |
|---|---|---|
| Public health | "Extend the reach and readiness of public health systems" | Frontline care, disease surveillance, disability services, food access, nutrition |
| Economic mobility | "Connect unemployed and underemployed residents to income, skills, and benefits" | Benefits enrollment, career navigation, skills-based hiring, employer-aligned training |
| Environmental resilience | "Forecast, withstand, and recover from environmental shocks" | Public safety and emergency services, energy and grid, land management |
| Civic engagement | "Reach residents proactively and respond faster" | Two-way service channels, participatory decision-making, digital access, court services, permitting. Not voting or elections |

The three projects that inspired the program show the pattern: Dengue.AI in Cali forecasts outbreaks so officials can target prevention; Cape Town runs an AI messaging platform for residents to engage with the city; Rio uses a WhatsApp chatbot that connects flood alerts and resident reports to emergency response. Each one plugs AI into a service the city already runs, on a channel residents already use.

## Their seven principles, and where we stand

| Their principle | What it means | Our charter today | Gap to work on |
|---|---|---|---|
| Respond to demand | Credible demand from government and the community | Needs register (charter, "Finding real problems") | We have no partner asking for anything yet. Demand evidence is the weakest part of our story |
| Start with the problem | A significant problem the city has prioritized | Needs register ranks problems | Link our needs to stated city and county priorities, with sources |
| Then plan a solution | Frontier AI capabilities are core, not decoration | AI agents keep data current and write plain language | Be clear about what only AI makes possible (reading many sources daily, plain-language rewriting, conversation) |
| Focus on readiness | Team and city can deploy in public settings | Open repo, charter limits, review rubrics | No government relationship yet |
| Build for sustainability | Integrate with city systems, plan who pays after | Static, cheap, open source | Write down operating costs and who could carry them |
| Act responsibly | Human oversight, privacy, accuracy, bias, security (they cite principles like those behind the EU AI Act) | Hard limits, sources on every fact, no personal data | Add an explicit bias and accessibility check for who we reach and who we miss |
| Plan to learn | Evaluation, user feedback, path to impact | Four-level scoreboard | Set numeric thresholds, like theirs: what must be true before real users rely on a tool |

## Lessons we should adopt now

1. **Plug into existing services and channels.** Their examples meet residents where they already are (text and WhatsApp) and feed existing city systems. We should favor texting and the city's own channels over building yet another website, and hand off to the organization that actually provides the service.
2. **Write the one-use walkthrough before building.** Their application asks: who starts it, what information goes in and from where, what the model produces, how the output is checked, and what happens next. Every tool we build should have that paragraph in its issue.
3. **Separate model quality from product quality.** They ask for both: model performance (accuracy, reliability against a defined standard) and product performance (adoption, task completion, time saved), with thresholds and a schedule. Our review gate and scoreboard should do the same.
4. **Decide what evidence a pilot must produce.** By the end of a seed pilot they want to know: does it work in practice, do people use it, are the early results enough to expand, and what would it take to sustain it.
5. **Name the vendors and their rights.** Who owns the code and data, and what rights model or hosting providers have. We already default to open licenses; say so in every project.
6. **Disclose AI use.** They require it in applications; we should keep doing it everywhere.
7. **Stay out of elections.** They exclude voting projects and voter registration drives entirely. Our charter allows nonpartisan links to official registration; keep that small and clearly separate from anything funded this way.

## Project directions for Mon County, through this lens

Starting points for the needs register (#44) to confirm or reject with evidence:

- **Benefits and assistance navigator (economic mobility):** a plain-language, text-friendly guide to programs and deadlines like energy assistance, food help, and tax help, with reminders before windows open and close. Builds on the deadlines calendar.
- **Food access (public health):** pantry schedules and mobile pantry dates pulled from the food bank's own pages, by neighborhood and transit route.
- **Two-way service channel (civic engagement):** help residents find the right city or county office and report problems, in the spirit of Cape Town's platform, if a public office wants it.
- **Public meetings made readable (civic engagement):** agendas and summaries of city and county meetings in plain language (see the meeting tracker issues).
- **Weather and flood readiness (environmental resilience):** only if the needs register shows real local risk; would require a public agency partner and careful handling of alerts.

## If we do apply someday

The full requirements and a draft application live in the private Notion home. The biggest gaps are the same as above: an eligible lead organization, a city partner willing to sign a letter of intent, and evidence of demand.
