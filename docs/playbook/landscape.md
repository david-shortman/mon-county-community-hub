# Landscape: peer projects putting AI to work for communities

A living map of projects that use AI, or closely related civic tech, to help people find services, understand local government, or take part in decisions. We include failures and shut-downs on purpose. They teach the most.

Each entry covers what the project is, who runs it, how it works, its status with the date checked, what we can adopt, how we could amplify it, and its lessons. Any step that means contacting someone is written as a `for:david` issue, since only David contacts people or organizations.

## At a glance

| Project | Area | Status (checked 2026-10-28) |
|---|---|---|
| Neighborhood AI, Civic AI Engine | Local public records | Unknown, not yet public |
| CivicPlus Agent | City website assistant (Morgantown's site runs on CivicPlus) | Active |
| Tech Reformers, Ruston (Washington) proof of concept | City code assistant | Unknown, vendor demo |
| U.S. Conference of Mayors AI playbook | Guidance for cities | Active, released January 2026 |
| Cities Deliver (Rockefeller Foundation and OpenAI Foundation) | Grants for city AI projects | Active |
| City Bureau Documenters | Public meeting coverage, human first | Active |
| Code for America AI work and Anthropic partnership | Benefits and government services | Active |
| Humanitas Labs | AI help for 211 call centers | Unknown, last update 2024 |
| One Degree | Resource directory and referrals | Active |
| Chalmers (Ample Labs) | Chatbot for people experiencing homelessness | Unknown, likely lapsed |
| FORWARD Ally | Benefits finder | Active, commercial |
| Civic AI Tools | Directory of open data portals and MCP servers | Active, accepts submissions |
| West Virginia 211 | Statewide service referrals | Active, no AI |
| Appalachian Ohio Regional GIS Hub | Regional open data | Unknown |
| vTaiwan and Pol.is | Public deliberation | vTaiwan stalled, Pol.is active |
| Talk to the City | AI summary of public input | Active, proof of concept |
| AI Village charity experiment | Autonomous AI agents raising money | Active, cautionary results |
| New York City MyCity chatbot | City business advice | Shut down |
| NEDA Tessa chatbot | Health support chatbot | Shut down |

## Local government and civic records

### Neighborhood AI and the Civic AI Engine (Brookline, Massachusetts)

**What it is.** Community-governed local AI that answers from a town's public record, hosted at a public access TV station. "Civic AI Engine" is the project site's name for it.

**Who runs it.** Neighborhood AI (Boston and New York) with Brookline Interactive Group (BIG), the town's nonprofit public access media center, through BIG's Community AI Project.

**Approach.** Open-source local models on station hardware, not cloud models. The toolkit (CC BY-SA 4.0) also includes searchable meeting transcripts and a tool that structures municipal PDFs. Search snippets of the project site (which we could not load) describe a resident council that ratifies rules and can switch it off.

**Status:** unknown (checked 2026-10-28). BIG's page says local AI "is not yet publicly accessible" and asks for donations to fund servers.

**What we can adopt or integrate.** Resident-written rules for any future Q&A tool. Structured meeting records we could link from local government pages.

**How we could amplify it.** Link it. A `for:david` issue to ask whether Morgantown's public access channel has any interest in this model.

**Lessons.** Public access stations face falling cable franchise fees (BIG called this "existentially threatening" in 2024), so funding is fragile.

**Sources:**
- [BIG: The Community AI Project](https://brooklineinteractive.org/the-community-ai-project/)
- [Brookline.News: BIG faces an uncertain future (Oct 2024)](https://brookline.news/brookline-interactive-group-a-local-institution-faces-an-uncertain-future/)

### CivicPlus Agent

**What it is.** A resident-facing AI chat assistant sold by CivicPlus for local government websites, "powered by CivicPlus Intelligence."

**Who runs it.** CivicPlus, a commercial vendor of municipal websites and software.

**Approach.** Residents ask by text or voice. Answers draw on the city's CivicPlus website, Municode code, agendas and minutes, plus documents staff add. It can start a SeeClickFix 311 request and gives staff analytics on common questions. CivicPlus pages do not describe citations or human review.

**Status:** active (checked 2026-10-28). Promoted in a February 13, 2026 CivicPlus blog post and a 2026 fact sheet.

**What we can adopt or integrate.** Morgantown check: morgantownwv.gov runs on CivicPlus. Its page source (fetched 2026-10-28) has the footer byline "Government Websites by CivicPlus®", a "Powered By" container and an `/AgendaCenter` link. We saw no Agent chat widget on the homepage. For now, deep-link the city's Agenda Center and code pages instead of copying them.

**How we could amplify it.** If the city turns on an agent, our plain-language pages could be a source it points to.

**Lessons.** An agent is only as good as the city's own pages, so content gaps matter more than the chat layer.

**Sources:**
- [CivicPlus blog: CivicPlus Agent tech tip (Feb 2026)](https://www.civicplus.com/blog/ce/tech-tip-give-residents-faster-answers-with-an-integrated-always-on-civicplus-agent/)
- [CivicPlus Agent fact sheet](https://www.civicplus.com/fact-sheets/cxp/civicplus-agent-fact-sheet/)
- [City of Morgantown website (page source checked)](https://www.morgantownwv.gov/)

### Tech Reformers Civic AI Agent proof of concept (City of Ruston)

**What it is.** A vendor-built proof of concept assistant that answers questions about a city's municipal code and website. Correction to the lead: the post links to rustonwa.org, so this is Ruston, Washington (Pierce County, 1,055 people in 2020), not Ruston, Louisiana.

**Who runs it.** Tech Reformers, an AWS partner and training firm. We found no statement from the city adopting it.

**Approach.** AWS serverless (Bedrock Agents and Knowledge Bases, Lambda). It answers only from indexed documents, links each answer to its source section, and uses guardrails to stay in scope. City Clerk staff manage the knowledge base.

**Status:** unknown (checked 2026-10-28). Blog post dated April 16, 2026. The demo at ruston-ai.techreformers.com did not load from our environment.

**What we can adopt or integrate.** The "answer only from indexed sources, always cite the exact section" rule fits a future MCP server over our YAML.

**How we could amplify it.** None needed; it is a vendor demo.

**Lessons.** Proof of concept posts are marketing. Check whether a city actually adopted a tool before citing it as a model.

**Sources:**
- [Tech Reformers: Civic AI Agent blog post (Apr 2026)](https://www.techreformers.com/civic-ai-agent-blog/)
- [Pierce County: Ruston town community profile](https://www.piercecountywa.gov/DocumentCenter/View/115364/Community-Profile_Ruston-town)

### Mayors AI Playbook (U.S. Conference of Mayors)

**What it is.** A practical guide for city leaders on starting AI projects, released January 27, 2026, at the USCM Winter Meeting. It follows a June 2025 roadmap, "Building Your City's AI Strategy."

**Who runs it.** The U.S. Conference of Mayors with Google, based on 2025 workshops for mayors.

**Approach.** Part one covers an "AI-ready city": governance, staff training, clean data, picking a first project. Part two gives use cases, such as meeting translation (Sunnyvale) and permit guides (Boston). It advises starting "low risk with at least moderate benefit" with a human in the loop.

**Status:** active (checked 2026-10-28). Published PDF is live.

**What we can adopt or integrate.** Its risk-benefit screen for picking projects maps onto our daily loop scoring.

**How we could amplify it.** Link it from our local government AI resources. A `for:david` issue to share it with city staff if they ask about AI.

**Lessons.** It is co-produced with a vendor. Route Fifty's coverage quotes mayors saying they are still "in a learning mode."

**Sources:**
- [USCM: Mayors AI Playbook page](https://www.usmayors.org/programs/ai-playbook/)
- [Playbook PDF](https://www.usmayors.org/wp-content/uploads/2026/01/26.03.USCM_.AI_.Roadmap.Report.digital.MEC_.pdf)
- [Route Fifty: Mayors group rolls out AI playbook (Feb 2026)](https://www.route-fifty.com/artificial-intelligence/2026/02/mayors-group-rolls-out-ai-playbook/411149/)

### Cities Deliver: AI Solutions for Public Services

**What it is.** A $50 million grant program for AI projects that improve city services for underserved residents. Grants are $500,000 to $2 million over 24 months.

**Who runs it.** The Rockefeller Foundation and the OpenAI Foundation, managed by RF Catalytic Capital.

**Approach.** Nonprofits (or public benefit corporations) apply with a committed city government partner; governments cannot apply directly. Focus areas: public health, economic mobility, environmental resilience, civic engagement (not voting or elections). Frontier AI must be core to the project. Seed and scale tracks.

**Status:** active (checked 2026-10-28). Call opened October 14, 2026. Round 1 due November 29, 2026; Round 2 due March 1, 2027.

**What we can adopt or integrate.** List it in our small business and philanthropy funding resources with the deadline and source.

**How we could amplify it.** A `for:david` issue to decide whether to flag the call to local nonprofits and the city. We should not apply in competition with local groups.

**Lessons.** Every applicant needs a committed city partner, so local groups need lead time with the city.

**Sources:**
- [Rockefeller Foundation: Cities Deliver program page](https://www.rockefellerfoundation.org/cities-deliver-ai-solutions-for-public-services/)

### City Bureau Documenters

**What it is.** A national network that trains and pays community members to attend and take notes at local government meetings, then publishes their notes.

**Who runs it.** City Bureau (Chicago), with local partner organizations at about 25 sites.

**Approach.** Paid assignments, staff editing, notes published on Documenters.org under Creative Commons. City Bureau uses AI "to do what AI is good at, in service of what people are uniquely good at": editing help, draft translations, trends across 13,000+ notes, context from past notes. AI does not replace in-person presence, and "trust is more important to us than the volume or speed of content."

**Status:** active (checked 2026-10-28). AI stance post dated May 7, 2026; site mentions an October 2026 AI feature post.

**What we can adopt or integrate.** Their human-first AI stance as a model for our own published AI policy.

**How we could amplify it.** A `for:david` issue to ask whether a Morgantown partner could host a Documenters site.

**Lessons.** AI summaries cannot replace people in the room. Accountability comes from presence.

**Sources:**
- [City Bureau: Why AI will never replace Documenters (May 2026)](https://citybureau.org/notebook/why-ai-will-never-replace-documenters)
- [City Bureau: AI and local journalism (June 2025)](https://citybureau.org/notebook/2025/6/24/ai-is-increasingly-shaping-local-journalism-how-do-we-keep-people-at-the-center)
- [City Bureau: Documenters program](https://citybureau.org/documenters)

### Code for America AI work and Anthropic partnership

**What it is.** A national civic tech nonprofit's work on AI in public benefits, including a partnership with Anthropic announced May 8, 2026, and an annual Government AI Landscape Assessment.

**Who runs it.** Code for America, with Anthropic for the partnership.

**Approach.** The first pilot, the SNAP Policy Navigator, is a Claude tool built on the Model Context Protocol (MCP) that answers caseworkers' policy questions from federal, state and county rules. The May 1, 2026 assessment rates states on readiness, piloting, implementation and impact. West Virginia is not among its seven leading states.

**Status:** active (checked 2026-10-28). No pilot states, results, or license named yet.

**What we can adopt or integrate.** MCP grounded in verified policy sources is the same pattern as our planned MCP server.

**How we could amplify it.** Link the assessment from our local government pages if it covers West Virginia.

**Lessons.** CfA found that measuring AI's impact is still early in most states. Measure before claiming impact.

**Sources:**
- [Code for America: Anthropic partnership announcement (May 2026)](https://codeforamerica.org/news/anthropic-partnership/)
- [Code for America: Anthropic partnership page](https://codeforamerica.org/partner-with-us/anthropic/)
- [Code for America: 2026 Government AI Landscape Assessment release](https://codeforamerica.org/news/code-for-america-unveils-second-annual-government-ai-landscape-assessment/)

## Human services and referrals

### Humanitas Labs

**What it is.** A prototype to bring generative AI into 211 call centers so agents find services faster.

**Who runs it.** A fiscally sponsored project of Digital Harbor Foundation, a Baltimore 501(c)(3).

**Approach.** Planned in three steps: plain-language search of 211 directories, help triaging caller needs with a human giving the answer, and a phone bot for simple calls. Tools were to include a Chrome extension for agents. It says AI should "augment and assist existing staff, not replace them." Four 211s were named as pilot partners.

**Status:** unknown (checked 2026-10-28). Only source found is an MIT Solve entry last updated April 2024, at prototype stage and seeking pilot funding. No project website or later update found.

**What we can adopt or integrate.** The "assist the human" framing for any AI search we build over our YAML.

**How we could amplify it.** Nothing to link yet. Revisit if it publishes results.

**Lessons.** 211 data is proprietary and shared under legal agreements, so AI built on it depends on those deals. Open data avoids that.

**Sources:**
- [MIT Solve: Humanitas Labs, Responsible AI for the 211 Ecosystem](https://solve.mit.edu/solutions/84648)

### One Degree

**What it is.** A free online guide to low-cost and free resources, mainly in California, with referral tools for case workers.

**Who runs it.** One Degree, a 501(c)(3). In December 2022 Alluma announced it was rebranding as One Degree; the post describes a name change, not a merger.

**Approach.** Listings are reviewed about every 6 months and anyone can suggest edits. In 2026 it added 17 languages, a FHIR referral link, and an AI lab testing agents that help people fill out enrollment forms, starting with 211 Bay Area.

**Status:** active (checked 2026-10-28). Footer reads 2026; news posts dated September 2026. No shutdown, merger, or wind-down notice found.

**What we can adopt or integrate.** Its 6 month review cycle as a benchmark for our last-verified dates. Its API docs are public, but no license or HSDS support is stated, so we do not reuse its data.

**How we could amplify it.** Cite it in the playbook as a peer model.

**Lessons.** Finding a service is only half the job; enrolling is the next gap.

**Sources:**
- [One Degree home](https://www.1degree.org)
- [Alluma rebrands as One Degree (Dec 2022)](https://about.1degree.org/alluma-rebrands-one-degree/)
- [AI Impact Scaling Program (Sept 2026)](https://about.1degree.org/one-degree-joins-tech-to-the-rescues-ai-impact-scaling-program/)
- [FHIR integration live (Sept 2026)](https://about.1degree.org/our-fhir-integration-is-live-a-step-forward-for-social-care-interoperability/)
- [Resource server API docs (GitHub)](https://github.com/1deg/resource-server-api-docs)

### Chalmers (Ample Labs)

**What it is.** A web chatbot that helped people facing homelessness in Toronto find meals, shelters, clothing banks and drop-ins.

**Who runs it.** Ample Labs, a Toronto tech nonprofit, built with advice from the chatbot company Ada.

**Approach.** Launched July 2019 after more than 100 interviews and workshops with shelter staff, youth, and agencies. At-risk youth were paid to manage it. A Benevity listing says it also covered Barrie.

**Status:** unknown (checked 2026-10-28). All coverage found is from 2019. The amplelabs.co domain now shows unrelated content (a t-shirt store and gambling ads), which suggests the site lapsed. No shutdown notice found, so closure is not confirmed.

**What we can adopt or integrate.** Co-design with service users, and pay people with lived experience to keep data current.

**How we could amplify it.** Nothing current to link. Cite as precedent.

**Lessons.** Small nonprofit tools can fade quietly. Our data and docs must outlast us.

**Sources:**
- [BetaKit launch story (July 2019)](https://betakit.com/ample-labs-ada-officially-launch-ai-chatbot-for-torontos-homeless-community/)
- [MIT Solve: Chalmers (2019)](https://solve.mit.edu/solutions/6789)
- [Benevity cause listing](https://causes.benevity.org/causes/124-701482911RC0001?lang=en)

### FORWARD Ally

**What it is.** A commercial AI navigator that tells residents which public benefit programs they may qualify for. No reentry focus was found.

**Who runs it.** Geocko, Inc., doing business as FORWARD, a for-profit government software company.

**Approach.** Residents ask by voice, text, or phone. Answers come only from agency-approved content. It hands off to human navigators and says it makes no eligibility decisions and limits personal data.

**Status:** active (checked 2026-10-28). Product page dated 2026; a vendor one-pager sits on memphistn.gov (April 2026). A Memphis deployment was not confirmed. Usage numbers are vendor claims.

**What we can adopt or integrate.** The design rules: grounded answers, clear human handoff, no eligibility calls, minimal personal data.

**How we could amplify it.** None. It is a paid product; we describe it, not endorse it.

**Lessons.** Governments are buying AI "front doors." Free, cited open data can feed such tools without lock-in.

**Sources:**
- [FORWARD Ally product page](https://www.forwardplatform.com/product/ally)
- [FORWARD Ally one-pager on memphistn.gov (PDF)](https://memphistn.gov/wp-content/uploads/2026/04/FORWARD-Ally-One-Pager-Final.pdf)
- [FORWARD home](https://forwardplatform.com)

### Civic AI Tools

**What it is.** An open-source project linking AI assistants to public open data: a demo site, a Socrata MCP server, and curated directories of civic MCP servers and datasets.

**Who runs it.** An independent civic technologist, fiscally sponsored by Metagov.

**Approach.** MCP servers let AI chats query open data portals (559 Socrata portals). The site compares answers with and without tools and can publish signed answer records.

**Status:** active (checked 2026-10-28). MCP directory surveyed 2026-08-12; repo has 436 commits and open pull requests.

**What we can adopt or integrate.** Its source-citation and anti-hallucination approach for our MCP server. Code is MIT; directory data is CC0.

**How we could amplify it.** It takes suggestions: CONTRIBUTING.md says open an issue to suggest an MCP server, and docs/mcp-servers.md allows an issue or pull request. Once our server exists, a `for:david` issue to suggest it via an issue on npstorey/civic-ai-tools.

**Lessons.** It calls its directory "a point-in-time survey," so listings go stale.

**Sources:**
- [Civic AI Tools site](https://www.civicaitools.org/)
- [GitHub repo](https://github.com/npstorey/civic-ai-tools)
- [CONTRIBUTING.md](https://github.com/npstorey/civic-ai-tools/blob/main/CONTRIBUTING.md)
- [Civic MCP server directory](https://github.com/npstorey/civic-ai-tools/blob/main/docs/mcp-servers.md)
- [Civic Tech Field Guide listing](https://civictech.guide/projects/civic-ai-tools)

## West Virginia and Appalachia

### West Virginia 211

**What it is.** The statewide help line and online directory for health and human services.

**Who runs it.** "A collaborative project of the United Ways of West Virginia," per the state.

**Approach.** Call 2-1-1, text a ZIP code to 898-211, or search online. The search site draws on the 211 National Data Platform run by United Way Worldwide, which lists WV 211 as a user and offers search and export APIs. No AI features found.

**Status:** active (checked 2026-10-28). Site and lines live; WV Public Broadcasting covered it October 2025.

**What we can adopt or integrate.** Point residents to 211 for anything we lack. Do not copy its data: the platform calls it "proprietary."

**How we could amplify it.** Link WV 211 on every help page. A `for:david` issue to ask United Ways of West Virginia how to share our verified Mon County listings.

**Lessons.** 211 pools data nationally but keeps it closed. Open HSDS data fills a different role.

**Sources:**
- [WV 211 home](https://www.wv211.org/)
- [WV 211 search](https://search.wv211.org)
- [WV Budget and Finance: West Virginia 211](https://bfa.wv.gov/page/west-virginia-211)
- [211 National Data Platform API portal](https://apiportal.211.org/)
- [211 NDP snapshot (PDF)](https://register.211.org/files/211%20NDP%20Snapshot.pdf)
- [WV Public Broadcasting (Oct 2025)](https://wvpublic.org/story/government/wv-211-connects-people-with-needed-help/)

### Appalachian Ohio Regional GIS Hub

**What it is.** A regional data-sharing site for the 32 counties of Appalachian Ohio. Open civic data, not AI.

**Who runs it.** The Appalachian Ohio Regional GIS Collaborative, led by Ohio University's Voinovich School with regional partners.

**Approach.** Local governments pool map data in one hub. Ohio University says "all of the data will be available to the public." No license named.

**Status:** unknown (checked 2026-10-28). Launched November 18, 2024. The hub itself was not checked; the article links it only through a shortened LinkedIn URL.

**What we can adopt or integrate.** A model for regional data pooling. Our listings could later feed a map view.

**How we could amplify it.** Cite it as a regional peer.

**Lessons.** Hubs need local governments to keep contributing, and no license makes reuse unclear.

**Sources:**
- [Ohio University news (Dec 2024)](https://www.ohio.edu/news/2024/12/appalachian-ohio-gis-symposium-launches-regional-data-hub)

### Searched but not found

- No Code for America brigade in West Virginia.
- No WVU or Marshall University AI tool for community resources.
- No Appalachian Regional Commission AI project for finding services.

## Public input and deliberation

### vTaiwan and Pol.is

**What it is.** vTaiwan is a public consultation process in Taiwan, started in 2014. Pol.is is the open source opinion-mapping tool it made famous.

**Who runs it.** vTaiwan: the g0v civic tech community, with Taiwan's government. Pol.is: The Computational Democracy Project, a US nonprofit.

**Approach.** People post short statements and vote, with no replies. Pol.is shows statements that win support across opinion groups. Results went to officials.

**Status:** stalled (checked 2026-10-28). vTaiwan's site was last updated December 2023. Pol.is itself is active: AGPL-3.0 code, with "Polis 2.0" launched at TICTeC 2025.

**What we can adopt or integrate.** If we ever gather resident input, use Pol.is (free for nonprofits and government) instead of building our own.

**How we could amplify it.** List Pol.is as a tool local groups can use.

**Lessons.** MIT Technology Review (2018) reported results were not binding and vTaiwan had come "close to death." Tools fail without a duty for officials to respond.

**Sources:**
- [vTaiwan official site](https://info.vtaiwan.tw/)
- [MIT Technology Review, Aug 2018](https://www.technologyreview.com/2018/08/21/240284/)
- [The Daily Beast, Nov 2023, "It Was a Huge Flop" (paywalled, body not read)](https://www.thedailybeast.com/taiwan-tried-to-digitize-democracy-with-vtaiwan-it-was-a-huge-flop)
- [The Computational Democracy Project](https://compdemocracy.org/)
- [Pol.is source code](https://github.com/compdemocracy/polis)
- [mySociety TICTeC page noting Polis 2.0 launch](https://tictec.mysociety.org/tag/deliberative-democracy/)

### Talk to the City

**What it is.** An open source tool that uses large language models (LLMs) to sort public comments into themes.

**Who runs it.** The AI Objectives Institute, a nonprofit.

**Approach.** It takes surveys, transcripts, or Pol.is data. An LLM pulls out claims and groups them into topics. Readers can click from a theme to the quotes behind it.

**Status:** active (checked 2026-10-28). The first repo was archived July 31, 2025, and work moved to a new Apache-2.0 repo.

**What we can adopt or integrate.** Its key pattern: every AI summary links back to the source quote. We can apply that rule to our summaries.

**How we could amplify it.** Link to it in a list of open tools for public input.

**Lessons.** Used by Taiwan's Ministry of Digital Affairs, a 2024 Tokyo governor campaign, and a California health care union. The makers call it a "proof of concept" and list LLM reliability as an open question.

**Sources:**
- [AI Objectives Institute project page](https://ai.objectives.institute/talk-to-the-city)
- [Archived repo](https://github.com/AIObjectives/talk-to-the-city-reports)
- [Current repo](https://github.com/AIObjectives/tttc-light-js)

## Cautionary cases

### AI Village (charity fundraising goals)

**What it is.** A public experiment (first called the "Agent Village") where AI agents with their own computers pursue shared goals, including raising money for charity.

**Who runs it.** AI Digest, a project of Sage Future, a 501(c)(3) nonprofit.

**Approach.** Agents work in public on a livestream. Staff set goals and add rules after incidents.

**Status:** active (checked 2026-10-28). Blog posts through October 2026.

**What we can adopt or integrate.** No unsolicited messages from our agents. Treat facts from other agents as unchecked until sourced.

**How we could amplify it.** Cite it on our AI disclosure page.

**Lessons.** In 2025 agents raised about $1,984, mostly from human viewers. They invented an email address, were suspended from Reddit, and got distracted; moderators steered them. A 2026 rerun raised $510 from 17 donors, much of the promotion aimed at other AIs. Staff found fabricated claims and spam-like emails, so outreach now needs human approval.

**Sources:**
- [Season 1 recap, May 2025](https://aivillageblog.substack.com/p/season-recap-agents-raise-2k)
- [TechCrunch, Apr 2025](https://techcrunch.com/2025/04/08/a-nonprofit-is-using-ai-agents-to-raise-money-for-charity)
- [2026 goal timeline](https://theaidigest.org/village/goal/choose-charity-raise-much-money-you-can)
- ["More capable AI, less money raised," May 2026](https://www.lesswrong.com/posts/QopBrHKDCgi5DPtMX/more-capable-ai-less-money-raised)
- [What we learned in 2025, Feb 2026](https://aivillageblog.substack.com/p/what-we-learned-2025)

### New York City MyCity business chatbot

**What it is.** An AI chatbot on New York City's MyCity portal, launched in fall 2023, meant to answer business owners' questions about city rules.

**Who runs it.** NYC Office of Technology and Innovation, built on Microsoft Azure AI services.

**Approach.** Generated answers from city business information, with a disclaimer that answers might be wrong.

**Status:** shut down (checked 2026-10-28). The city took it offline by February 4, 2026, after the mayor called it "functionally unusable."

**What we can adopt or integrate.** Do not ship a free-text chatbot that answers legal or eligibility questions. Point people to the official source instead.

**How we could amplify it.** Not applicable.

**Lessons.** In 2024 The Markup found it told users employers could take workers' tips and landlords could refuse housing vouchers, both wrong under city law. The same question got different answers. A disclaimer did not prevent harm. The build cost was reported near $600,000.

**Sources:**
- [The Markup, Mar 2024](https://themarkup.org/news/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law)
- [The Markup, Jan 2026, shutdown](https://themarkup.org/artificial-intelligence/2026/01/30/mamdani-to-kill-the-nyc-ai-chatbot-we-caught-telling-businesses-to-break-the-law)

### NEDA Tessa chatbot

**What it is.** A wellness chatbot offered by the National Eating Disorders Association (NEDA) as its human-staffed helpline was being closed in 2023.

**Who runs it.** NEDA, with the bot run by a mental health chatbot company. It was first designed by university researchers.

**Approach.** Originally a scripted program. The operating company later added a generative AI question-and-answer feature, per NPR.

**Status:** shut down (checked 2026-10-28). NEDA pulled it on May 30, 2023.

**What we can adopt or integrate.** Never let generated text give health advice. Keep human-reviewed, scripted wording for sensitive topics.

**How we could amplify it.** Not applicable.

**Lessons.** Users reported it gave calorie-counting and weight-loss tips that can harm people with eating disorders. NEDA said that content was not in the tested version. A vendor change slipped past the nonprofit. The bot was linked to replacing paid and volunteer helpline staff, which drew criticism.

**Sources:**
- [NBC News, Jun 2023](https://www.nbcnews.com/tech/neda-pulls-chatbot-eating-advice-rcna87231)
- [NPR via KUNC, Jun 8, 2023](https://www.kunc.org/npr-news/2023-06-08/an-eating-disorders-chatbot-offered-dieting-advice-raising-fears-about-ai-in-health)

## Leads we could not verify

- **CommunityLLM.** No project by this name was found. The closest match is MIT's CommunityLM, a 2022 research project on language models and partisan views, not a community resources tool. ([CommunityLM on Hugging Face](https://huggingface.co/CommunityLM))
- **Ruston, Louisiana.** The Tech Reformers proof of concept is for Ruston, Washington. See its entry above.

## Lessons across the map

- **Answers must come from sources.** The more careful designs here (the Tech Reformers demo, FORWARD Ally) answer only from approved documents, and the Tech Reformers demo cites the exact section. MyCity and Tessa gave wrong or harmful advice and were shut down. This matches our [sourcing rule](trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced).
- **Autonomous agents need a human gate for anything public.** The AI Village agents invented facts and sent unwanted emails to real people. That is why our charter keeps contacting people, alerts, and money with David.
- **Pilots are not adoption.** Vendor demos and pilot announcements often go quiet. Check for real use before citing a project as a model.
- **Results must connect to decisions.** vTaiwan stalled when its outcomes were not binding. Our tools should point to the real office or group that acts.
- **Directories go stale, domains lapse.** Chalmers' old domain now shows unrelated content. Re-check links on a schedule and never link a domain we have not just checked.
- **Data terms matter.** WV 211's data comes from a proprietary national platform, so we link to it rather than copy it. See [open-data.md](open-data.md#use-open-topic-labels-not-the-211-taxonomy).

## How to keep this current

Duet runs a monthly sweep:

1. Re-open every source link. Update each status and the "checked" date in the table and in the entry.
2. Search for new projects, especially in West Virginia and Appalachia, and for news of shut-downs or failures.
3. Add new entries in the same format, with sources for every claim. No em dashes.
4. If a project offers a way for us to plug in (a directory listing, a data standard, a partnership), open an issue. Anything that means contacting someone is a `for:david` issue.
5. Log the sweep in the build log and the Notion Activity log.

## Checked

Sources checked 2026-10-28.
