# Writing rules: how we write about this place and this project

These rules answer fair criticism that projects like ours have faced: AI "local news" sites that rewrote reporters' work, outsiders who told Appalachia's story as all problems, tech pitched as "doing more with less", and AI projects that claimed more than they could show. They sit on top of the [plain language rubric](../rubrics/plain-language.md) and the [trust rubric](../rubrics/trust-and-civic-ethics.md). The automated PR review checks them as criterion TR9 in the trust rubric.

Each rule says what to do, why, and how to check it. They came from #501, part of #490.

## 1. Credit local news, never rewrite it

**Do.** Use the group's own page or an official page as the source whenever one exists. When a news story is the only source, name the outlet, link the story, and keep to the one fact you need. Never retell or summarize a story as our own writing.

**Why.** AI local news networks shut down after rewriting local reporters' work (Axios Richmond, April 3, 2026, https://axios.com/local/richmond/2026/04/03/nota-ai-news-sites-shut-down-plagiarism; Editor and Publisher, August 18, 2026, https://www.editorandpublisher.com/stories/opinion-more-than-200-ai-generated-local-news-sites-just-went-dark,263091). Local reporters here do work we depend on.

**Check.** Every news source in a PR is named by outlet in the text or the source line, and the page uses at most the one fact it needs from that story.

## 2. No deficit or pity framing

**Do.** Write about help and neighbors. Name the local groups as the ones doing the work. Describe a problem only as much as a reader needs to find help with it, and use numbers with their source, not adjectives ("struggling", "poor", "left behind").

**Why.** Appalachian writers push back on outsiders telling the region's story as all problems (WVPB, October 2, 2020, https://wvpublic.org/story/economy/appalachian-journalists-tackle-stereotypes-and-economy-with-new-outlets/; NPR via OPB, August 17, 2024, https://opb.org/article/2024/08/17/hillbilly-elegy-is-back-in-the-spotlight-these-appalachians-write-a-different-tale).

**Check.** Read the page as someone who lives here. Look for pity words and for sentences where the site, not a local group, is the one helping.

## 3. No "efficiency" framing

**Do.** Say what the site does for a resident. Do not pitch it as doing more with less, replacing staff, or cutting costs for anyone.

**Why.** "Efficiency" has a history here. WVU faculty blamed "ill-informed consulting and faulty data" for the 2023 program cuts (West Virginia Watch, September 6, 2023, https://westvirginiawatch.com/2023/09/06/facing-program-cuts-and-layoffs-wvu-faculty-overwhelmingly-pass-no-confidence-vote-in-gee/).

**Check.** Search the changed text for "efficient", "efficiency", "streamline", "do more with less", "save time for", "replace".

## 4. No claim we can't show

**Do.** Every claim about what the AI or the project does links to a page, log or file anyone can open: the build log, the scoreboard, a data file, the Corrections page. If there is nothing to link, do not make the claim. Say "not yet" instead.

**Why.** An AI agents project on Hacker News was mocked when its "live" dashboard turned out to be an animation (https://news.ycombinator.com/item?id=47296664, early 2026). One claim we can't back up makes readers doubt the rest.

**Check.** For each sentence about the project ("we check", "every day", "a person reviews"), find the link or the file that shows it.

## 5. Keep who runs and funds it current

**Do.** If who runs the project, who pays for it, or its legal form changes (for example a nonprofit, a grant, a partner), update the About page and the Hard questions page in the same PR.

**Why.** Partisan sites posing as local news say little about who funds them (Axios, June 11, 2024, https://www.axios.com/2024/06/11/partisan-news-websites-dark-money). Being plain about this is part of why people can trust us.

**Check.** A PR that mentions money, funding, a partner or who runs the project also changes `site/src/pages/about.astro` and `site/src/pages/hard-questions.astro`, or says why not. These PRs wait for David.

## Sources checked

The sources above were cited in #501 and the criticism map behind #490, and their links were copied on October 30, 2026. This page quotes only what the issue reported from them. Re-check them by April 30, 2027.
