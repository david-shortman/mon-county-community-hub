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
| West Virginia 211 | Statewide service referrals | Active, no AI (rechecked 2026-11-01) |
| TheLink (Hope in Action Alliance and WVU CED) | Resource finder app for 13 north central WV counties, including Monongalia | Pilot, launched July 2026 (checked 2026-11-01) |
| Appalachian Ohio Regional GIS Hub | Regional open data | Unknown |
| vTaiwan and Pol.is | Public deliberation | vTaiwan stalled, Pol.is active |
| Talk to the City | AI summary of public input | Active, proof of concept |
| AI Village charity experiment | Autonomous AI agents raising money | Active, cautionary results |
| New York City MyCity chatbot | City business advice | Shut down |
| Denver "Sunny" chatbot | City 311 questions and reports | Contract voted down October 2026 (checked 2026-11-01) |
| NEDA Tessa chatbot | Health support chatbot | Shut down |
| Crescent City Intel | City code, meetings and hazard alerts (California) | Active, open source |
| Nano Media | AI-written local news (Massachusetts, Maine) | Active, Maine site slower |
| Civic Sunlight | AI meeting summaries by email (Maine and New England) | Active as of 2025 |
| LocalLens and Hearst Meeting Monitor | AI watching public meetings for newsrooms | Active |
| Local Resilience | City code answers and AI-drafted news (Minnesota) | Unknown, demos broken |
| Civic Strata | Shared research hub for one issue | Pilot |
| Maricopa County Mari | County website assistant (Arizona) | Active, launched 2026 |
| LinkLocally | Resource directory with a needs matcher (Wisconsin) | Active, commercial |
| myCityCoPilot | City assistant app (Pensacola, Florida) | Active, commercial |
| LocalWiki | Community-written local wikis | Stalled |
| Colorado regional sustainability hub (Bili) | Local data with an AI assistant | Early research |

## Local government and civic records

### Neighborhood AI and the Civic AI Engine (Brookline, Massachusetts)

**What it is.** Community-governed local AI that answers from a town's public record, hosted at a public access TV station. "Civic AI Engine" is the project site's name for it.

**Who runs it.** Neighborhood AI (Boston and New York) with Brookline Interactive Group (BIG), the town's nonprofit public access media center, through BIG's Community AI Project.

**Approach.** Open-source local models on station hardware, not cloud models. The toolkit (CC BY-SA 4.0) also includes searchable meeting transcripts and a tool that structures municipal PDFs. Search snippets of the project site (which we could not load) describe a resident council that ratifies rules and can switch it off.

**Status:** unknown (checked 2026-11-01). BIG's page still says "we are still a ways away from making local AI publicly-accessible" and asks for donations to fund servers.

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

**Status:** active (checked 2026-11-01). Call opened October 14, 2026. Round 1 due November 29, 2026; Round 2 due March 1, 2027. Revised FAQs are due November 4, 2026.

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

### Maricopa County Mari (Arizona)

**What it is.** An AI assistant on every Maricopa County website that answers questions across county departments.

**Who runs it.** Maricopa County, built on IBM watsonx.

**Approach.** Pulls answers from across departments, links to the official source, and sends people to their city government when the county is not the right office.

**Status:** active (checked 2026-10-30). Launched around July 2026.

**What we can adopt or integrate.** The "which office handles this" problem is the same one our local government guide (#20) tackles. Its rule of always linking the official source matches ours.

**How we could amplify it.** Not applicable.

**Lessons.** Government can solve the cross-department problem inside its own sites. An independent hub adds value by also covering nonprofits and by spanning city, county and state.

**Sources:**
- [Smart Cities Dive, Sep 3, 2026](https://www.smartcitiesdive.com/news/local-government-is-fragmented-heres-how-ai-is-helping-residents-navigate/829540/)

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

### LinkLocally (Northeast Wisconsin)

**What it is.** A searchable directory of about 6,100 organizations in 18 counties. A "say what you need" box ranks matches and explains why each one fits.

**Who runs it.** Build With You AI, a brand of Execentra LLC (commercial), published with Insight on Philanthropy.

**Approach.** Built from public sources plus corrections. Its stated rule: AI organizes and flags changes, people decide what gets published. The matcher says it does not save questions, and the site says it is not for emergency, clinical, legal or benefits decisions.

**Status:** active (checked 2026-10-30). Also has a newcomer guide and a career tool. A workforce app is in testing.

**What we can adopt or integrate.** A needs matcher that explains its reasoning. The plain "AI flags, a person publishes" rule. A clear note on what the tool is not for.

**How we could amplify it.** Not applicable (different region).

**Lessons.** Paid "Enhanced and Featured" profiles show first, with labels. Paid placement works against neutral ordering, so we should keep plain relevance or alphabetical order.

**Sources:**
- [LinkLocally](https://linklocally.org)

### myCityCoPilot (Pensacola, Florida)

**What it is.** An AI chat assistant for living in Pensacola: events, restaurants, doctors, ER wait times, beaches and weather.

**Who runs it.** A commercial company. Neither site names the owner.

**Approach.** The company site says it draws on city records, tourism boards, chambers of commerce, news and calendars, with citations. The Pensacola site itself says only "local sources." It sits inside a consumer app with dining deals, home listings and paid partner listings.

**Status:** active (checked 2026-10-30). Its roadmap lists New Orleans as in progress and Tampa as planned.

**What we can adopt or integrate.** Little. It shows that a single-city assistant can be packaged and repeated in other cities.

**How we could amplify it.** Not applicable.

**Lessons.** It shows ER wait times and storm routes with no note on how current they are. Time-sensitive answers need a source and a date beside them.

**Sources:**
- [myCityCoPilot](https://mycitycopilot.com)
- [PensacolaCoPilot](https://www.pensacolacopilot.com)

## West Virginia and Appalachia

### West Virginia 211

**What it is.** The statewide help line and online directory for health and human services.

**Who runs it.** "A collaborative project of the United Ways of West Virginia," per the state.

**Approach.** Call 2-1-1, text a ZIP code to 898-211, or search online. The search site draws on the 211 National Data Platform run by United Way Worldwide, which lists WV 211 as a user and offers search and export APIs. No AI features found.

**Status:** active (checked 2026-11-01). Site and lines live ("Dial 2-1-1, Text your Zip Code to 898-211"); WV Public Broadcasting covered it October 2025.

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

### TheLink (north central West Virginia)

**What it is.** A free resource finder app for people, families and service providers in West Virginia Prevention Region 4: Randolph, Barbour, Tucker, Upshur, Lewis, Braxton, Doddridge, Gilmer, Harrison, Marion, Monongalia, Preston and Taylor counties. Users search local services, save the ones they use and set appointment reminders in the app's calendar.

**Who runs it.** Hope in Action Alliance (HIAA), a West Virginia nonprofit, with the WVU Center for Excellence in Disabilities.

**Approach.** Built from community input gathered starting in 2025. Available in the Apple and Google app stores and on the web. The news story does not say whether it uses AI.

**Status:** pilot (checked 2026-11-01). Launched July 2026. Its next phase is "launch, field testing, outreach, evaluation," and later the rest of the state.

**What we can adopt or integrate.** It covers Monongalia County, so residents may find both. Our open listings (with sources and checked dates) could help keep its Mon County entries current, if HIAA wants that.

**How we could amplify it.** A `for:david` issue to ask HIAA whether our open data or listings would be useful to TheLink, and whether we should link it.

**Lessons.** A peer is building the same kind of tool for the same county. Connect, don't compete: share data instead of duplicating effort.

**Sources:**
- [The Inter-Mountain: Pilot app to help residents find services, support (Jul 7, 2026)](https://www.theintermountain.com/news/local-news/2026/07/pilot-app-to-help-residents-find-services-support/)
- [TheLink web app](https://thelinkapp.io)

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

## Local news and meeting records

### Crescent City Intel (Crescent City, California)

**What it is.** An open-source "civic intelligence" system for one small city: its municipal code, public meetings, local news and hazard alerts.

**Who runs it.** A single developer (GitHub user docxology). Content is licensed CC BY-SA 4.0.

**Approach.** Scrapes the city code (2,206 sections in its latest check) and fingerprints every page with a SHA-256 hash, so changes and errors show up. Offers keyword search and a local AI chat (Ollama) that cites code sections. Tracks news feeds, meeting agendas and transcripts, and 20 hazard and civic feeds. Weekly GitHub Actions publish a static snapshot to GitHub Pages. A source registry (`src/source_registry.ts`) marks every source as `monitored`, `discovery-only` or `reference-only`, with a provenance note and the URL it was found from. In its own words, this "prevents a Pages snapshot from implying that an unimplemented source was checked." Each source also reports its health (ok, empty, unavailable or stale) apart from whether the pipeline ran.

**Status:** active (checked 2026-10-30). 369 commits, last one 2026-10-29.

**What we can adopt or integrate.** The three-way source registry and per-source health, for our freshness work (#122, #16, #166). Showing a gap as "unavailable" rather than staying silent.

**How we could amplify it.** Link it as a reference design. Possible peer contact later, tracked in #98.

**Lessons.** The closest match in method we found. Its focus is knowing what is happening in the city, not filling residents' information gaps, so it does not pick and build new guides or tools.

**Sources:**
- [crescent-city-intel on GitHub](https://github.com/docxology/crescent-city-intel)

### Nano Media (Arlington, Massachusetts and Bucksport, Maine)

**What it is.** AI-written local news sites that cover town meetings, public records and local websites.

**Who runs it.** Nano Media Inc., a Massachusetts nonprofit started by two Arlington residents.

**Approach.** AI transcribes, summarizes and fact-checks source material, and articles are published with what it calls "minimal human intervention."

**Status:** active (checked 2026-10-30). Inside Arlington's newest story is from Aug 13, 2026. Bucksport's newest is from Mar 21, 2026, and its headline names a meeting two days after that date, which suggests a date error.

**What we can adopt or integrate.** Short plain-language summaries of recorded city council and county commission meetings (#12, #13).

**How we could amplify it.** Not applicable.

**Lessons.** A local media critic argued that AI digests do not replace reporting and that Arlington was not a "news desert." The Bucksport date slip shows how errors pass with little human review.

**Sources:**
- [Nano Media](https://nanomedia.org)
- [CBS Boston on Inside Arlington](https://www.cbsnews.com/boston/news/inside-arlington-massachusetts-local-news-nano-media-artificial-intelligence-winston-chen-david-trilling)
- [Dan Kennedy, Sep 26, 2023](https://dankennedy.net/2023/09/26/no-arlington-is-not-a-news-desert-and-the-globe-should-have-done-some-checking/)

### Civic Sunlight (Maine and New England)

**What it is.** A startup whose AI turns city council meeting video into free email summaries, with time-stamped links back to the video.

**Who runs it.** A small Maine company. It partners with the Midcoast Villager, whose reporters use the summaries as leads.

**Approach.** AI summaries of about 20 towns' meetings, sent to over 1,000 subscribers (2025 figures).

**Status:** active as of May 2025 (checked 2026-10-30). We did not find later news.

**What we can adopt or integrate.** Time-stamped links from each summary point to the exact moment in the meeting video.

**How we could amplify it.** Not applicable.

**Lessons.** An early summary falsely reported that Concord, New Hampshire approved funding. Meeting summaries need a human check and a link to the source.

**Sources:**
- [Columbia Journalism Review, May 15, 2025](https://www.cjr.org/analysis/ai-local-news-civic-sunlight-maine.php)

### LocalLens and Hearst Meeting Monitor

**What it is.** Two tools that transcribe and summarize local government meetings, with search and alerts, mostly for newsrooms.

**Who runs it.** LocalLens was bought by American Public Media in November 2025. Meeting Monitor is the public version of Hearst's in-house tool, launched for Houston Chronicle readers.

**Approach.** Chalkbeat used LocalLens to watch about 80 school districts in 30 states. Meeting Monitor is a searchable database of meeting transcripts and summaries.

**Status:** both active (checked 2026-10-30). Accuracy claims are the companies' own.

**What we can adopt or integrate.** Keyword alerts on agendas, for topics residents care about.

**How we could amplify it.** Not applicable.

**Lessons.** Meeting monitoring has become a product category, so a hub can link to such tools where they exist rather than rebuild them.

**Sources:**
- [Nieman Lab, Mar 13, 2025](https://www.niemanlab.org/2025/03/local-newsrooms-are-using-ai-to-listen-in-on-public-meetings) (loaded through search results only)

### Local Resilience (Owatonna, Minnesota)

**What it is.** A small research group with five projects: Civic Scout (plain-English answers about city ordinances, with citations), Observer (AI-drafted local news), The Hub (software for neighborhood groups), Arcstone (an offline knowledge box) and Charter (legal text turned into machine-readable rules).

**Who runs it.** Not stated. The site lists only an email address.

**Approach.** Observer says every AI draft is reviewed by a person before it is published.

**Status:** unknown (checked 2026-10-30). The site lists the projects as "Production," but the Civic Scout demo has an expired security certificate and the Observer demo returns 404.

**What we can adopt or integrate.** Ordinance search with citations would fit Morgantown and county codes. The "a person reviews every AI draft" rule.

**How we could amplify it.** Not applicable.

**Lessons.** Small projects go stale quietly. Check our own links, certificates and uptime on a schedule.

**Sources:**
- [Local Resilience](https://localresilience.org)
- [Civic Scout project page](https://localresilience.org/projects/civicscout)

### Civic Strata

**What it is.** A shared research hub on one issue for journalists, nonprofits and organizers. It pools documents, public records results, laws, reporting and expert sources.

**Who runs it.** Mariann Martin, as a Reynolds Journalism Institute fellow.

**Approach.** AI tags incoming material and a human editor approves it. Every item has a name, a date, a summary and a source link. Membership is free under a collaboration agreement, and some material is for members only.

**Status:** pilot (checked 2026-10-30). The first issue is data centers.

**What we can adopt or integrate.** Its item format (name, date, summary, source, human approved) is close to our sourcing rule and is a useful comparison.

**How we could amplify it.** Possible peer contact later, tracked in #98.

**Lessons.** Groups in one place often collect the same records separately. A shared, sourced store saves everyone work.

**Sources:**
- [RJI, Aug 17, 2026](https://rjionline.org/news/building-a-civic-information-hub/)
- [Civic Strata](https://civicstrata.info/)

## Open community knowledge

### LocalWiki

**What it is.** Community wikis that anyone can edit, about 149,000 pages across 3,138 regions.

**Who runs it.** LocalWiki, a 501(c)(3) nonprofit. Knight Foundation was a past funder.

**Approach.** Open editing by residents. Content is CC BY 4.0 and the code is open source (GPL-2.0).

**Status:** stalled (checked 2026-10-30). The site is up, but the newest blog post is from July 2015 and the last code change from January 2018. Code for Philly lists the Philadelphia wiki as "Hibernating."

**What we can adopt or integrate.** We already use CC BY 4.0 for content, the same choice.

**How we could amplify it.** Not applicable.

**Lessons.** Open editing alone did not keep pages fresh. Without paid or automated upkeep, content went stale. That is the gap an AI-maintained hub is meant to fill, and the risk it must avoid.

**Sources:**
- [LocalWiki](https://localwiki.org)
- [LocalWiki on Wikipedia](https://en.wikipedia.org/wiki/LocalWiki)

### Colorado regional sustainability hub (Bili)

**What it is.** An early research platform that links Colorado policymakers, researchers and residents through shared sustainability and well-being data.

**Who runs it.** Researchers at Colorado State University.

**Approach.** An AI chat assistant called Bili, a framework for testing AI models called BiliCore, open-source tools and community asset mapping, built with community input and beta testing.

**Status:** early research (checked 2026-10-30). Paper dated July 21, 2025.

**What we can adopt or integrate.** BiliCore's approach to testing AI answers may help if we ever add a Q&A feature.

**How we could amplify it.** Not applicable.

**Lessons.** A university-led version of an open, local, AI-assisted hub. It focuses on one topic and on helping policymakers decide.

**Sources:**
- [Co-creating a regional sustainability hub (Mountain Scholar)](https://mountainscholar.org/items/81c0a0f7-f7ca-4700-a646-1aa9028c5f12)

## Research on local information

- **LocalBench (AAAI 2026).** A benchmark of 14,782 questions about 526 U.S. counties, built from Census data, local Reddit posts and local news. The best AI model got 56.8% of narrative questions right, with web search. On numbers, every model scored at or below about 15%. The paper's text and its table disagree on a few figures, so cite the table. **For our findability method:** it picks counties across rural, suburban and urban groups, tags each question by kind of local knowledge (being current, place, culture, community and so on), and scores "gave any answer" apart from "gave the right answer." We could tag our 32 questions the same way to check the mix, and add a few questions with one checkable number, such as a fee or a bus fare. Its automatic AI grading does not fit our human-style scoring. ([arXiv 2511.10459](https://arxiv.org/abs/2511.10459), [data](https://github.com/MadCollab/LocalBench))
- **Civic Information Needs Census.** A national survey (Wave 2, February 2026) by Civic News Company with Embold Research. 44% of adults find it hard to get information about their neighborhood and 42% about their city or town, against 26% for national news. The largest gaps between how important a topic is and how satisfied people are: politics (46 points), environment (40), economic opportunity (39), health (38), risks and emergencies (37), education (35). Emergencies rank as the most important topic overall, at 95%. One summary list on the home page shows emergencies at 38, so cite the gaps page. ([Information gaps](https://infocensus.org/share/information-gaps))
- **Brookings, "Could AI help communities navigate complex challenges like the US data center boom?" (Sep 30, 2026).** Ten authors, led by Jacob Taylor and Scott E. Page. It proposes a four-step cycle (Surface, Align, Implement, Learn) and tested it in a simulation of a fictional Michigan county. It lists eight design principles, including AI in a supporting role, keeping outlier views visible and community control of data. Real-world results are untested. ([Brookings](https://www.brookings.edu/articles/ai-community-problem-solving-data-centers/))
- **News Futures, "An Invitation to Build the Civic Information Economy" (Mar 24, 2026).** A working group paper arguing that civic information is its own sector and should be funded by public outcomes, with feedback loops with residents. No dollar figures. ([News Futures](https://www.newsfutures.org/library/civic-information-endowment))
- **NSF Open Knowledge Network (launched Sep 25, 2026).** A free national network linking 43 public knowledge graphs on health, environment, justice and more. A possible data source for community health metrics, once we check county coverage. ([NSF](https://www.nsf.gov/tip/updates/nsf-launches-open-knowledge-network-national-open-data))

## Open-source tools and patterns

Checked 2026-10-30. These are building blocks, not community services. Listed for patterns worth borrowing.

- **Civic Newsroom.** Nine editorial prompts for an AI local newsroom, with a four-step check that looks for counter-evidence before anything is published. Tested on Longmont, Colorado data. MIT. A prompt kit, no updates since June 2026. The same author's civic-scanner is newer. ([GitHub](https://github.com/scottconverse/civic-newsroom))
- **Civic SLM.** A small open AI model being tuned for local government documents, with model and data cards and four test sets (facts, refusals, extraction). Weights not released yet. MIT. ([GitHub](https://github.com/itsmeduncan/civic-slm))
- **Townlight Records (formerly CivicSunshine).** Staff software for public records requests that runs on city hardware. Every flag needs a person to confirm it. AGPL-3.0, public beta. ([GitHub](https://github.com/townlight/sunshine))
- **CivicDigest.** Plain-English summaries of council minutes, plus paid AI voice and video. A solo demo. MIT. ([GitHub](https://github.com/Brandi-Kinard/civicdigest))
- **Indore Civic Services Q&A Agent.** A hackathon chatbot for five city services in English and Hindi. It answers only from its sources, shows only the sources it used, and gives a helpline when unsure. No license, so the code is not reusable, but the rules are worth copying. ([GitHub](https://github.com/R123456-123/civic-services-qa-agent))
- **SAG.** A self-hosted knowledge base that traces every answer back to the original text. MIT, company-run. More than a static site needs today. ([GitHub](https://github.com/Zleap-AI/SAG))
- **LLM Wiki.** A pattern, "human curates, AI maintains," with several open-source apps. This repo already works roughly this way. ([nashsu/llm_wiki](https://github.com/nashsu/llm_wiki))
- **Busabase.** A shared database where AI edits arrive as reviewable change requests. GitHub pull requests already give us this. MIT. ([GitHub](https://github.com/busabase/busabase))
- **GPT Researcher.** An agent that splits a question, searches many sources and writes a cited report. Apache-2.0. Could help with first-pass research, with every claim still checked at the source. ([GitHub](https://github.com/assafelovic/gpt-researcher))
- **Argus.** A runtime for long agent jobs where a read-only reviewer must approve the work and the builder cannot mark its own work done. A pattern relevant to our multi-agent setup. MIT. ([microsoft/ArgusAgent](https://github.com/microsoft/ArgusAgent))
- **The World Avatar (Cambridge).** A research "digital twin" built on a knowledge graph that software agents keep current. Too heavy for our needs. ([Cambridge](https://como.ceb.cam.ac.uk/research/twa/))
- **Also checked, little to adopt:** Civic Hub (San Francisco open data projects, no dates on its data, probably stalled; [civichub.us](https://civichub.us)) and CityByApp (a commercial directory with paid listings, clustered in a few towns, many expired items; [citybyapp.com](https://citybyapp.com)).

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

### Denver "Sunny" 311 chatbot

**What it is.** An AI chatbot that answers simple questions and takes non-emergency 311 reports, like potholes, for the City and County of Denver.

**Who runs it.** The city, through a contract with the company Citibot.

**Approach.** Text chat on city channels. The city says about 40% of 311 contacts this year came through Sunny and its online reporting hub, with a 90% satisfaction rating. A contract extension would have added a "voicebot" for 311 phone calls.

**Status:** uncertain (checked 2026-11-01). On Tuesday, October 13, 2026, the City Council voted 9 to 3 against a five-year, $3.9 million extension. The contract was paid through the end of October, and the mayor's office said it would look for a way to keep the service. We found no later report.

**What we can adopt or integrate.** Nothing to reuse.

**How we could amplify it.** Not applicable.

**Lessons.** Council members said it "often provides inaccurate information" and replaces jobs people should have. Accuracy and how a tool affects local workers both decide whether it lasts. Our tools point to people and offices, never replace them.

**Sources:**
- [GovTech, from The Denver Post (Oct 14, 2026)](https://www.govtech.com/artificial-intelligence/denver-ai-chatbot-sunny-may-go-dark-after-contract-vote)
- [Denver7: After council pushback, Denver's AI chatbot faces uncertain future](https://www.denver7.com/news/local-news/after-council-pushback-denvers-ai-chatbot-faces-uncertain-future)

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
- **FixIt (two AI agents, 2026 hackathon).** No repo matched. Several hackathon projects use the name, but none has two agents. Checked 2026-10-30.
- **Nieman Lab, "Local news starts becoming local infrastructure" (Ulrike Langer, Dec 16, 2025).** The essay exists, but the page would not load, so we could not confirm which tools it names. A newsletter says Village Media licenses its AI tools to about 120 publishers. ([Nieman Lab](https://www.niemanlab.org/2025/12/local-news-starts-becoming-local-infrastructure/))
- **Village Media and OpenAI "Open Door."** Reported by Axios (Sep 15, 2026) as a community health and care navigation platform. Not yet checked.

## Lessons across the map

- **Answers must come from sources.** The more careful designs here (the Tech Reformers demo, FORWARD Ally) answer only from approved documents, and the Tech Reformers demo cites the exact section. MyCity and Tessa gave wrong or harmful advice and were shut down. This matches our [sourcing rule](trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced).
- **Autonomous agents need a human gate for anything public.** The AI Village agents invented facts and sent unwanted emails to real people. That is why our charter keeps contacting people, alerts, and money with David.
- **Pilots are not adoption.** Vendor demos and pilot announcements often go quiet. Check for real use before citing a project as a model.
- **Results must connect to decisions.** vTaiwan stalled when its outcomes were not binding. Our tools should point to the real office or group that acts.
- **Directories go stale, domains lapse.** Chalmers' old domain now shows unrelated content. Re-check links on a schedule and never link a domain we have not just checked.
- **Data terms matter.** WV 211's data comes from a proprietary national platform, so we link to it rather than copy it. See [open-data.md](open-data.md#use-open-topic-labels-not-the-211-taxonomy).
- **Show gaps as gaps.** Crescent City Intel marks sources it does not yet watch as visible gaps, never as quiet successes. Our pages should say plainly when something has not been checked.
- **AI flags, a person publishes.** LinkLocally, Civic Strata, Local Resilience's Observer and Townlight all keep a human approval step. The projects that published with little review (Nano Media's Bucksport site, early Civic Sunlight) are where errors showed up.
- **Open editing alone goes stale.** LocalWiki had thousands of pages and little upkeep after 2018. Freshness needs a scheduled, owned process.
- **Keep ordering neutral.** Paid placement (LinkLocally, CityByApp) puts money into what residents see first.

## How to keep this current

Duet runs a monthly sweep:

1. Re-open every source link. Update each status and the "checked" date in the table and in the entry.
2. Search for new projects, especially in West Virginia and Appalachia, and for news of shut-downs or failures.
3. Add new entries in the same format, with sources for every claim. No em dashes.
4. If a project offers a way for us to plug in (a directory listing, a data standard, a partnership), open an issue. Anything that means contacting someone is a `for:david` issue.
5. Log the sweep in the build log and the Notion Activity log.

## Checked

Sources checked 2026-10-28. Entries added from the October 30 peer research checked 2026-10-30 (#473).

### Sweep of 2026-11-01 (#55)

- **Links re-opened:** 97. 68 loaded. 19 GitHub pages could not be read from our build sessions (GitHub only lets them reach this project's own repository), so the Talk to the City, Pol.is, Crescent City Intel, Civic AI Tools and open-source tool entries keep their October dates. 9 other pages refused automated reads (HTTP 403 or 503: Brookline.News, Code for America, CivicPlus, Smart Cities Dive, CityByApp, News Futures), and civicaitools.org's robots.txt says no, so we did not read it. Those entries also keep their earlier dates.
- **Statuses rechecked and still the same:** Neighborhood AI (still not public), Cities Deliver (Round 1 due November 29), West Virginia 211.
- **Added:** TheLink, a resource finder pilot that covers Monongalia County, and Denver's "Sunny" chatbot as a cautionary case.
- **Searched, nothing new found:** an AI resource directory launched in West Virginia in 2026, and Appalachian civic AI tools for residents.
- **Next sweep:** early December 2026, on Duet's schedule. A person should re-read the GitHub and refused pages in a browser.
