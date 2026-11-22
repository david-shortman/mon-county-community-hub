# Feedback triage: who reads what first, and how each fix is logged

The recurring job from #371. It ties together the ways reports come in (#197, #522), the checking rules ([`checking-corrections.md`](../playbook/checking-corrections.md), #168) and the public Corrections page (`/corrections/`, #158). Written 2026-11-14 in sprint wave 18 (#529).

## Where reports come in

| Way in | Who reads it first | What reaches GitHub |
|---|---|---|
| The fix form on Tally (`FIX_FORM` in `site/src/lib/group-requests.mjs`), linked from "Report a problem" and "Tell us" on every page | David, in his own Tally and Gmail | Only what a team member files on David's yes: a **Group request** or **Feedback (project team)** issue, in our words |
| fix@everythingmorgantown.org (`FIX_EMAIL`) | David, in his own Gmail | Same as above |
| The public "Suggest a resource or correction" GitHub form | Anyone, since it is public. The site no longer links to it, but it still works. | The issue itself, with its "How do you know about this?" answer |
| Our own checks (source check, page watches, checklists, sweeps) | The session doing the check | The PR that fixes it |

**Raw messages never reach an agent that can write to the repo** (#522). Agents work only from the issues a team member files. A sender's name, email, phone or message text never goes into an issue, a corrections file or a PR.

## The order to read them in

1. **Same day: removals, privacy, and help people need tonight.** A removal request, anything about a private person, and any report about shelter, crisis help or food. These follow the [group request clock](group-requests.md) or rule 4 of the checking rules ("Pull it while we check"). 211 and 988 are never hidden.
2. **Next: reports from people who work at a place or help others find services.** Answers "I work or volunteer at this place" and "I help people find services" (#371). They know about changes first. Being read first does not mean being trusted without a check.
3. **Then everything else,** oldest first.

A Group request is from the group itself, so it is always in step 2 or step 1.

## For each report

Follow the checklist at the end of [`checking-corrections.md`](../playbook/checking-corrections.md). In short: confirm the change on a current source we open ourselves, use a separate official source for any new phone number, address, link or email, hide a risky item we cannot confirm, and never take a fact from the report alone.

## Log every fix in `content/corrections/`

Every fix to a fact, link or out-of-date detail gets one file (schema in [`content/README.md`](../../content/README.md), "corrections"). Typos get none. A "still correct" check gets a new `checked` date and no file.

Set `found_by` from where the report came from:

| Where it came from | `found_by` |
|---|---|
| Group request issue | `works-there` |
| Feedback issue, "How the sender knows": works or volunteers there | `works-there` |
| Feedback issue: helps people find services | `helper` |
| Feedback issue: used it | `used-it` |
| Feedback issue: not given, or other | `other` |
| Public GitHub form: use its "How do you know about this?" answer the same way | as above |
| Our own source check, watch, checklist or sweep | `our-check` |

Never name the person or group who reported it. If a group asks for public credit, open a `for:david` issue first.

## Once a week

- Look for open issues from the public GitHub form (search the repo's open issues for "Organization or resource name") and for open **Feedback (project team)** issues. Work them in the order above.
- Close each one with a link to the PR and its corrections file, or with a note of what was checked if nothing changed.

## What we cannot do yet

- **The Tally form does not ask how the sender knows.** Until it does, a report through the form can be marked `helper` or `works-there` only if the sender said so and David notes it in the issue. Adding the question is in David's account, so it is listed on #1530.
- **People hear back only through the Corrections page.** Agents never contact anyone (charter). If a sender asks for a reply, David answers from his own inbox.

## Status when this was written

Checked 2026-11-14: no open issues from the public GitHub form, no open Feedback (project team) issues, and no open Group request issues. So there were no helper reports waiting.
