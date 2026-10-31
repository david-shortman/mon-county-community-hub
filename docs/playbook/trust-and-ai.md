# Trust and AI

This site is built mostly by AI agents, and residents may use it to find help with food, bills, health care, and deadlines. That means trust depends on two things: being honest that AI is involved, and making sure AI never adds a fact that a real source does not support. This page collects practices from government AI guidance, newsroom standards, and fact-checking codes, and turns them into concrete rules for this repo.

## Disclose AI involvement in plain words

**What it is.** Public bodies and newsrooms increasingly tell readers when AI helped make something. NIST's Generative AI Profile (NIST AI 600-1) suggests organizations "consider disclosing use of GAI to end users in relevant contexts" (action MP-5.1-003). Boston's 2023 interim guidelines tell city staff to disclose AI use and name the model. The Partnership on AI's synthetic media framework asks creators to disclose synthetic content, either directly (a visible label) or indirectly (metadata). AP labels any AI-generated illustration in its caption.

**Why it matters here.** Almost all of this site is drafted by Claude. A resident who learns that later, instead of up front, has a reason to doubt everything else.

**How we apply it.** Keep a short AI statement on `site/src/pages/about.astro` and a one-line version in the footer of `site/src/layouts/Base.astro`. Draft for the About page:

> Most of this site is researched and written by an AI assistant (Claude, made by Anthropic). The AI only repeats facts it found in a public source, and every listing links to that source and shows the date it was last checked. A person, not the AI, oversees the project, and anyone can see our work and our mistakes on GitHub. AI can still get things wrong, so please confirm details with the organization before you act, and tell us if something is off.

We will not use AI-generated images of real places or people, and we will not let any page sound like it speaks for a government office or nonprofit.

**Sources:**
- [NIST AI 600-1, Generative AI Profile (PDF), action MP-5.1-003](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [NIST AI Risk Management Framework overview](https://www.nist.gov/itl/ai-risk-management-framework)
- [City of Boston, Guidelines for Using Generative AI (2023, PDF)](https://boston.gov/sites/default/files/file/2023/05/Guidelines-for-Using-Generative-AI-2023.pdf)
- [Partnership on AI, Responsible Practices for Synthetic Media](https://syntheticmedia.partnershiponai.org/)
- [AP, Standards around generative AI](https://www.ap.org/the-definitive-source/behind-the-news/standards-around-generative-ai/)

## Treat AI output as unchecked until sourced

**What it is.** NIST AI 600-1 names "confabulation" as a core generative AI risk: "confidently stated but erroneous or false content," often called hallucinations. It warns AI can also invent citations. AP says any AI output "should be treated as unvetted source material." Boston tells staff to fact-check all AI content, "especially if it will be used in public communication." The SPJ Code of Ethics, revised in 2026, says journalists are responsible for their work "regardless of the tools and technologies used."

**Why it matters here.** A made-up phone number, office hour, or income limit could send someone to the wrong place or make them give up on help they qualify for.

**How we apply it.** Every fact in a `content/` YAML file must appear on a page listed in that entry's `sources`. An agent must fetch the source page in the same session it writes or re-checks the entry. It must not fill gaps from memory or "common knowledge." If the source does not say it, the field stays empty. Never cite a URL that was not opened and read. A PR that adds content says in its description which source supports which field.

**Sources:**
- [NIST AI 600-1, section 2.2 Confabulation (PDF)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [AP, Standards around generative AI](https://www.ap.org/the-definitive-source/behind-the-news/standards-around-generative-ai/)
- [City of Boston, Guidelines for Using Generative AI (PDF)](https://boston.gov/sites/default/files/file/2023/05/Guidelines-for-Using-Generative-AI-2023.pdf)
- [SPJ Code of Ethics](https://www.spj.org/spj-code-of-ethics/)

## Quote eligibility, dates, and costs from the source

**What it is.** The SPJ Code says to "use original sources whenever possible." The IFCN Code asks fact-checkers to give enough source detail that readers can check the work themselves. When rules are complex, paraphrasing is where errors creep in.

**Why it matters here.** Eligibility rules, deadlines, and costs are the details people act on. A plain-language rewrite that drops "for households with children" changes who applies.

**How we apply it.** For `who_it_is_for`, `starts`, `ends`, and `cost`, copy the source's wording or numbers as closely as plain language allows. If a simple version would change the meaning, keep the source's words and add "See the full rules at the link." Never compute a limit (for example, turning a percent of the poverty line into a dollar amount) unless the source states that number. Never guess a date: `content/README.md` already says to leave the item out until it is published.

**Sources:**
- [SPJ Code of Ethics, "Seek Truth and Report It"](https://www.spj.org/spj-code-of-ethics/)
- [IFCN Code of Principles, commitment 2](https://ifcncodeofprinciples.poynter.org/the-commitments)

## Extra human review for high-stakes information

**What it is.** OMB memo M-25-21 (April 2025, which replaced M-24-10) requires federal agencies to provide "human oversight, intervention, and accountability" for high-impact AI, and a timely human review and chance to appeal. We found no newer memo replacing it. NIST AI 600-1 notes confabulation risk is highest in areas like health care and consequential decisions.

**Why it matters here.** The site is not a federal agency, but the same logic fits. Wrong details about health, benefits eligibility, legal rights, or deadlines can cause real harm.

**How we apply it.** Treat entries with topics `health`, `money`, `housing`, `family`, `taxes`, or `voting`, and every `calendar/` entry, as high stakes. These get a second, independent check against the source before merge: a different session (or Duet) re-opens each source and confirms each field, and notes it in the PR. We will not give advice on someone's own case ("you qualify"). We describe the program and point to the office that decides. On top of that, David checks changes about shelter, crisis help, food and benefits before they go live (his decision, October 30, 2026, #493). The exact list is in "When a PR waits for David" in `docs/COORDINATION.md`.

**Sources:**
- [OMB M-25-21, Accelerating Federal Use of AI (PDF)](https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf)
- [NIST AI 600-1, section 2.2 (PDF)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

## Show the source and last-checked date on every listing

**What it is.** The IFCN Code asks signatories to let readers "verify findings themselves." The SPJ Code says to "provide access to source material" and to "gather, update and correct information throughout the life of a news story."

**Why it matters here.** A date tells a resident how fresh the item is. A link lets them confirm it with the organization that runs it.

**How we apply it.** `site/src/components/EventCard.astro` already shows source links and "Last checked." Every future card type (orgs, resources) must do the same. When an entry has several sources, show the oldest `checked` date, not the newest, so we never overstate freshness (the current card shows the newest). Flag entries past 6 months, as `content/README.md` requires, and show a visible "may be out of date" note instead of hiding the problem.

**Sources:**
- [IFCN Code of Principles, commitment 2](https://ifcncodeofprinciples.poynter.org/the-commitments)
- [SPJ Code of Ethics](https://www.spj.org/spj-code-of-ethics/)

## Publish a corrections policy and follow it

**What it is.** The IFCN Code requires an easy-to-find corrections policy, and says fixes must be made openly so people who saw the error can see the correction. PolitiFact separates major errors (a mark at the top), other factual errors (a note at the bottom), typos (fixed silently), and dated updates. The SPJ Code says to correct mistakes "promptly and prominently."

**Why it matters here.** The charter says one wrong item can undo months of work. A visible correction shows the error was taken seriously.

**How we apply it.** Draft corrections outline for the About page:

1. **What counts:** wrong facts, broken or wrong links, out-of-date details, and wording that is not neutral.
2. **How to tell us:** the "Report a problem" link on each listing.
3. **What we do first:** for high-stakes items (health, benefits, legal, deadlines), hide the item until it is re-checked.
4. **How we fix it:** re-check the source, fix the entry, and update the `checked` date.
5. **How we show it:** a dated "Corrected" note on the item for major errors; typos fixed without a note.
6. **Public record:** every correction is a public GitHub issue and PR, and gets a file in `content/corrections/`, shown on the public Corrections page. How we check a report before it changes anything: [checking corrections](checking-corrections.md).
7. **What we may not act on:** opinions about which groups to list, requests without a source, or anything that would add private personal information.

**Sources:**
- [IFCN Code of Principles, commitment 5](https://ifcncodeofprinciples.poynter.org/the-commitments)
- [PolitiFact, Principles of the Truth-O-Meter (corrections section)](https://www.politifact.com/article/2018/feb/12/principles-truth-o-meter-politifacts-methodology-i/)
- [SPJ Code of Ethics, "Be Accountable and Transparent"](https://www.spj.org/spj-code-of-ethics/)

## Make reporting a problem easy

**What it is.** M-25-21 tells agencies to give "end users and the public" a way to submit feedback on AI use. NIST AI 600-1 suggests structured public feedback processes (MP-5.1-004). The IFCN Code asks for a way for readers to make contact.

**Why it matters here.** Residents and partner groups will spot errors before we do. Corrections submitted also count toward measurement Level 4 (Recognition).

**How we apply it.** The footer in `Base.astro` links to the `suggest-resource.yml` issue form. Add a "Report a problem" link to every card that pre-fills the form with the item's slug and URL. Many residents do not have GitHub accounts, so a no-account option is needed. Picking a form tool or contact address means creating an account, so that is a `for:david` issue. The form must keep its note asking people not to share private information. We will not collect names or emails unless David decides a reply channel is needed.

**Sources:**
- [OMB M-25-21 (PDF)](https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf)
- [NIST AI 600-1 (PDF)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [IFCN Code of Principles, commitment 3](https://ifcncodeofprinciples.poynter.org/the-commitments)

## Explain our methods and who runs the project

**What it is.** The IFCN Code asks fact-checkers to explain how they select, research, publish, and correct work, and to disclose funding and organization. The UK's Algorithmic Transparency Recording Standard (ATRS) is a public template for describing how an algorithmic tool is used. It is mandatory for UK government departments and recommended for the wider public sector.

**Why it matters here.** People trust a process they can see. We already publish the charter and decisions, but residents need a short summary they can read.

**How we apply it.** Add a "How we work" section to the About page, loosely modeled on an ATRS record: what the AI does, what it does not do, who oversees it, how items are chosen and checked, and how the project is funded, if at all. David should confirm the funding wording, so that line goes in a `for:david` issue. Link to `docs/CHARTER.md`, `docs/decisions.md`, and this playbook.

**Sources:**
- [IFCN Code of Principles, commitments 3 and 4](https://ifcncodeofprinciples.poynter.org/the-commitments)
- [GOV.UK, Algorithmic Transparency Recording Standard hub](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub)

## Checked

Sources checked 2026-10-28.
