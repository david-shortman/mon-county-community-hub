# Checking reported corrections before they go live

What happens to a report ("this phone number is wrong," "they moved," "hours changed") before it changes a listing. Intake is the "Suggest a resource or correction" form and the "Report a problem" link on every card. Triage order and logging are the recurring job in #371. This page is the checking step in between. From #168.

## The short version

1. **A report is a tip, not a fact.** It changes a listing only after we confirm it on a current source we can open.
2. **A new phone number or address needs a separate source.** Never take it from the report alone.
3. **"Still correct" gets a date, not an edit.** When a report or a re-check says nothing changed, update the checked date and change nothing else.
4. **Risky and can't confirm yet? Hide it, don't guess.** Use the `hidden` block while we check.
5. **Log every fix** in `content/corrections/` with `found_by`, and never name who reported it.

## Why

- **Directory standards require a review before publishing.** The Inform USA standards (the professional standards for information and referral services such as 211) say "all updates are reviewed by a Database Curator prior to the content being published," and call for "a process for gathering and integrating new and interim information changes (e.g., changes that occur between annual verification)" (Standard 10.2, version 10.0, July 2024, https://www.informusa.org/Standards). 211 Virginia tells agencies that "All new or updated listings are reviewed and approved by a 211 Virginia Database Curator" and "Changes will not appear on the public search until approved" (Decoding the Directory training, February 2025, https://211virginia.org/wp-content/uploads/2025/02/Training-Decoding-the-Directory.pdf).
- **Swapped phone numbers are a known scam.** In March 2025, Google said it removed more than 10,000 fake or hijacked Maps listings, some of which sent calls meant for real businesses to scammers (CBS News, March 19, 2025, https://www.cbsnews.com/news/google-maps-fake-listings-lawsuit-scams/). A wrong number on a help listing sends a resident to the wrong place, or to someone who should not have their call.
- **"Last checked" and "last changed" are different facts.** OpenStreetMap records when a detail was last checked with `check_date`, and per detail with keys like `check_date:opening_hours`, "particularly useful for tags with information that changes often, such as opening_hours" (https://wiki.openstreetmap.org/wiki/Key:check_date, page edited May 18, 2026). Open Referral's data standard keeps `assured_date` ("the date that the information about the service was last checked") apart from `last_modified` (https://openreferral.readthedocs.io/en/latest/hsds/schema_reference.html).
- **Corrections should rest on evidence and be open.** The IFCN fact-checking code asks signatories to "correct clearly and transparently" (https://ifcncodeofprinciples.poynter.org/the-commitments). Our [corrections policy](trust-and-ai.md#publish-a-corrections-policy-and-follow-it) already follows it.

## The rules

### 1. Confirm on a source, then change

For each report:

1. Open the listing's own sources. If one of them already shows the change, update the record from that source, set its `checked` date, and log the fix.
2. If not, look for the change on the group's own website or page, then a government listing (for example a county or state directory). Add that page to `sources` with today's date.
3. If no current source shows it, do not change the listing. Leave a comment on the report saying what we checked. If the fact can't be confirmed but matters, follow the [unverified facts rule](../decisions/2026-10-30-0640-unverified-facts-get-an-issue.md): open a `needs-verification` issue with what we know and the human follow-up.

A report that says "I work there" (`works-there`) or "I help people find services" (`helper`) is read first (#371). It still needs a source. Being read first is not the same as being trusted without a check.

### 2. Phone numbers, addresses and links: a separate source, every time

A report that gives a **new** phone number, address, website or email is never enough on its own, whoever sends it.

- Confirm the new detail on the group's own site, or a government or other official page, that we open ourselves.
- Do not confirm a new number by calling the new number. Anyone can answer a phone. A person calling to confirm calls the **old** known number or the number on the group's own site (the call rules in `content/README.md`, "Call only the public number on the listing").
- If the old number is reported as wrong but no source shows the new one: if it is high stakes, hide the listing with `reason: unconfirmed-risky` (see rule 4); otherwise leave it and open a `needs-verification` issue.
- The daily source check already flags a number in our data that no longer appears on a fetched source. Treat that flag the same way: confirm, then fix.

### 3. "Still correct?" stamps a date

When a source re-check, a phone confirmation, or a report confirms a detail is unchanged:

- Update `checked` on the source that showed it (or `phone_confirmed` for a call, per `content/README.md`). Change nothing else.
- No corrections file is needed, since nothing was wrong.
- A report that only says "this is still right" with no source is thanks, not a check. It does not change the date.

### 4. Pull it while we check, when it is risky

If a report says a high-stakes detail is wrong (shelter, food, crisis help, benefits, health, a deadline) and we cannot confirm or rule it out today, add a `hidden` block with `reason: unconfirmed-risky` and today's `since` date. The card then says we are re-checking it. A PR that only hides an item does not wait for David (see "When a PR waits for David" in `docs/COORDINATION.md`). 211 and 988 are never hidden.

Bringing the item back means removing the block after the check, and that PR is checked like any other change.

### 5. Log it, credit no one by name

Every fix to a fact, link or out-of-date detail gets one file in `content/corrections/` (schema in `content/README.md`), with `found_by` from the report's optional answer. Typos need no file. Never name the person or group who reported it. If a group asks for public credit, that goes to David first.

### 6. Groups correcting their own listing

A group that reports its own change goes through the same check: we confirm it on its own site or another official page. If the change is not on any page yet (for example new hours that start next month), the human follow-up in the `needs-verification` issue can be a call to the group's known public number. Calls wait on David (#156, #165). A per-group update link or account, like 211 Virginia's agency dashboard, would be a later step and needs an outside tool, which is David's call.

### 7. Spam

The current form is a GitHub issue form, so GitHub's own account rules apply and a hidden "honeypot" field is not possible. When #48 picks a form that works without an account, add a hidden field that people can't see and bots fill in. A filled-in honeypot field means a bot sent the form, and it "can be safely rejected" (Netlify Forms docs, https://docs.netlify.com/manage/forms/spam-filters/). A honeypot stops simple bots only, so pair it with the tool's bot check or rate limit.

### 8. Tell people to check before they go

A reviewed and rewritten listing is still our words, and details change between checks. Listings should say to check with the group before going. Today, place cards say "Call to confirm," event cards say "Call to confirm the time," and some pages have a "Call before you go" line, and every resource card says "Details can change, so check with them first," or the stronger "This may be out of date" line once a listing is past its re-check date (#942). Crisis lines that are always open skip the reminder.

## Checklist for one report

- [ ] Read the listing and its sources
- [ ] Found the change on a current source we opened? Then fix, set `checked`, add the source, log in `content/corrections/`
- [ ] New phone, address, link or email? Confirmed on a separate official page, not from the report or the new number
- [ ] Not confirmed and high stakes? Hide with `unconfirmed-risky`
- [ ] Not confirmed otherwise? Comment what was checked; open a `needs-verification` issue if it matters
- [ ] No reporter named anywhere
- [ ] High-stakes record changed? The PR waits for David (the High stakes check labels it)

## Sources checked

All sources above were opened on October 31, 2026, except as noted. The Inform USA standards site says version 10.1 (updated October 2025) is current; the quotes are from version 10.0, and 10.1 may word them a little differently. We found no Google post for the March 2025 removals, so we cite the CBS News report. Re-check by April 30, 2027.
