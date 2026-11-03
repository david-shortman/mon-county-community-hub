# Plan: one inbox for resident and partner feedback

For #197 (sprint wave 10, #529). Written 2026-11-02. Builds on what is already live: the private fix form and email from #522, the one-week clock for group requests (#521, [`docs/operations/group-requests.md`](../operations/group-requests.md)), and the Corrections page.

## The rule that shapes everything

**Raw messages never reach an agent that can write to the repo** (#522). A resident's words, name, email or phone stay with David. What reaches GitHub is a short note in our own words, filed by a person on the project team after David says yes. The repo is public, so this is also what keeps personal information out of it.

## What exists today (all $0)

| Way in | Where it lands | Cost |
|---|---|---|
| "Report a problem" and "Tell us" links on every listing, page and the footer | The fix form on Tally (`FIX_FORM`), in David's account. Hidden fields pass only the listing slug and the page path. | Free plan: unlimited forms and submissions (tally.so/pricing, read 2026-11-02) |
| fix@everythingmorgantown.org | Forwards to David's private Gmail (Porkbun forwarding) | Free with the domain |
| Group request issue form (project team only) | A public issue with the item, kind, change and received date, and no sender details. The clock acts within 7 days. | GitHub Actions on a public repo: free |
| GitHub issues | Public. Kept for the people who work on the project (decided 2026-10-31). | Free |

So the "one inbox" is mostly there already. Both residents' ways in reach David privately. What is missing is a single place David looks, a way for non-group feedback to become work, a way people hear back, and a few channels the issue asked about.

## Recommended setup

### 1. One inbox: David's Gmail, with one label

- Turn on Tally's email notification to David for the fix form. The free plan includes "self email notifications" (tally.so/pricing, read 2026-11-02). Then form answers and fix@ mail land in the same Gmail inbox.
- One Gmail filter puts both under one label, for example "Everything Morgantown feedback". Free.
- No new account and no new tool. **Needs David:** it is his Tally and Gmail.

### 2. One form, four kinds

Add one required choice to the top of the existing Tally form, so every page link still works:

- Something is wrong on this page
- Please remove something
- I work at or volunteer for this group (a partner update)
- A suggestion or a question

The first three follow the group request runbook as they do today. The fourth is new: it covers "Suggest something" and general feedback. **Needs David:** the form is in his account.

### 3. David triages once or twice a week

For each message, David does one of these:

- **Group fix, removal or add:** a team member files a **Group request** issue, as today. The clock runs.
- **Other feedback worth acting on** (a missing topic, a confusing page, a new resource): a team member files a **Feedback (project team)** issue, the new form in this PR. It has the page, the kind, what to do in our words, the received date and a "Serves:" line (#1037). No sender details or message text.
- **Spam, abuse or nothing to do:** delete it. Nothing reaches GitHub.

Agents work only from those issues. Duet's morning brief can count how many issues came from feedback each week (a count of issues, never messages).

### 4. How people hear back

- **The Corrections page** already lists each fix by date and page. The form's thank-you text can say: "If we change the page, it will show on our Corrections page within a week." Nobody is contacted, and nobody has to leave an email.
- **If someone leaves an email and asks for a reply,** David answers from his own inbox. Agents never contact anyone (charter).

### 5. Spam and abuse

- Every message passes a person (David) before anything is filed, so spam costs time, not trust.
- The free plan lists "Prevent duplicate submissions" (tally.so/pricing). We could not confirm from a page we may read what other spam settings the free plan has; David can check the form's settings.
- If spam grows: a Gmail filter on obvious patterns (free), then a CAPTCHA on the form if Tally offers one on the free plan. The paid plan (Pro, $24 a month, tally.so/pricing) is not needed for any step here.
- Abuse aimed at a named person is deleted and never filed. A removal request about a private person is always acted on.

### 6. Channels the issue asked about

| Channel | Recommendation | Cost |
|---|---|---|
| A short form on every page | Done (the fix form). Add the four kinds above. | $0 |
| Email to a project inbox | Done (fix@). Keep one address so people do not have to choose. | $0 |
| Text replies | Wait for David's texting decision (#99, #169). Texting costs money per message with any provider, so it needs his yes. When it comes, replies forward into the same Gmail label. | Not free; depends on the provider |
| Partner updates about their own listings | Done through the form and the group request clock. The "For groups and helpers" page (`/partners/`) explains it. Add the "I work at this group" kind. | $0 |
| Quick "Was this helpful?" reactions | Not now. A per-page counter would need either a new service or a change to the visit counter, and today visit totals are only copied by hand, once a month (`content/use/visits.yaml`, #1432). Revisit after the first monthly visit totals. If built, keep counts only: no free text, no visitor IDs. | $0 to try, but needs David's call |

### 7. Plain language and access

- Form text at about an 8th grade level, no em dashes. Each choice is a full, short sentence.
- Test the form at 320px wide with text at 200%, and with a screen reader, before changing it. Tally hosts the form, so we can test it but not fix Tally's own code.
- Say on the form that it needs no account and is not posted in public, as the site's links already do.

## Follow-up work

| Who | What | Cost |
|---|---|---|
| David | Turn on the form's email notification, add the Gmail label, and add the "What kind?" choice and thank-you line to the form | $0 |
| David | Decide on quick reactions after the first visit totals | $0 |
| Claude Code (after David's form change) | Pass the kind from the page where it is obvious (for example "Suggest something" links), using the same hidden-field helper `fixFormUrl` | $0 |
| Duet | Count feedback-born issues in the morning brief; add "resident and partner feedback" to the monthly persona review (#1037) as topic counts | $0 |

Anything that needs an outside account, money or contacting people stays with David.

## Done in this PR

- This plan.
- A **Feedback (project team)** issue form (`.github/ISSUE_TEMPLATE/feedback.yml`) for non-group feedback, with the same no-sender-details rule as the Group request form.
