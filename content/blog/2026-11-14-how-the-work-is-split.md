---
title: How the AI work is split up
date: 2026-11-14
type: how-it-works
summary: Several AI sessions work on this site at once. Each one takes a set of tasks, claims them in public, and makes small changes that programs check. A person still decides anything about shelter, crisis help, food or benefits, money, outside contact, and the project's own rules.
pages: [/how-it-works/, /about/]
---
Most of this site is built by AI. But it is not one AI doing everything. This post explains how the work is split up, using the project's public rules in [How we work](https://github.com/david-shortman/mon-county-community-hub/blob/main/docs/COORDINATION.md) and the page [How this site works](/how-it-works/).

## Who does what

- **The owner** sets the direction and the rules. The owner is the only one who talks to outside groups for the project, and the only one who can spend money or open accounts.
- **Claude Code, the builder,** writes listings, pages and tools.
- **Claude Duet, the partner in the background,** looks for gaps, ranks ideas and reviews what was built. It sums up each day for the owner.
- **Automatic programs** check every change, rebuild the site, recheck sources and watch the site's health. Most use no AI at all.

Both AI helpers are Claude, made by Anthropic.

## Tasks are public issues

Every piece of work starts as an issue on GitHub: a short public note saying what is needed and why. Labels sort them. For example, `for:code` marks build work, `needs-verification` marks a fact that is not on the site until it can be confirmed, and another label marks something only the owner can decide.

Before an AI session starts on an issue, it claims it. It adds an `in-progress` label and leaves a comment. That way two sessions don't do the same work.

## Lanes

When there is a lot to do, the work is split into lanes. Each lane is its own AI session with its own list of issues. The first big push, in the week of October 26, 2026, had 14 lanes, such as "Get care", "Storms and seasons" and "Data platform and API" ([#529](https://github.com/david-shortman/mon-county-community-hub/issues/529)). Each lane stays in its own files, which keeps sessions from changing the same lines at the same time.

This post was written in one of those lanes, in a later round of the same push.

## Small changes, checked by programs

Each change is a pull request: a public proposal with a note on what changed and why. Before it can merge, programs check it. They check that every listing has a source and a date, that no link is broken, and that pages work on a small phone with large text. A second AI run reviews it against the project's guides for sources, plain words, fairness and privacy.

The session that made the change merges it, if the checks pass, using a script that refuses anything marked for the owner.

## What a person still decides

A change waits for the owner when it:

- changes what residents see about shelter, crisis help, food or benefits
- changes the project's rules
- has anything to do with money, passwords or outside accounts
- speaks for the project to an outside person or group

A program called the High stakes check labels the first kind on its own. Every blog post waits for the owner too.

On its own, the AI may never contact anyone, send alerts to the public, spend money or take sides. [About this site](/about/) lists these limits in full.

## Where it slows down

The owner is one person. On November 8, 2026, 124 open items were waiting for the owner, by the project's [week two notes](https://github.com/david-shortman/mon-county-community-hub/blob/main/docs/chronicle/2026-11-08-week.md). AI sessions can draft quickly. A person still has to sign off on the parts that matter most.
