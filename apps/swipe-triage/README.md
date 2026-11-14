# Swipe Triage

A phone-first page for deciding what needs you on a GitHub repo. It walks
through open issues with your "needs me" label (default `for:david`) and open
PRs, one card at a time. Swipe or tap:

| Swipe | PR | Issue |
|---|---|---|
| Right | Merge | Go ahead |
| Left | Close | Close |
| Up | Discuss | Discuss |
| Down | Later | Later |

On a PR, "Needs changes first" turns a right swipe into "Merge after
changes": you approve it once the changes in your note are made, and it goes
back to a session before anyone merges it.

Each card can also take a weight (1 low to 5 top) and a note. Undo takes back
the last call. When you're done, Review lets you change any call, then copy a
prompt (or download it as .md, or the calls as .json) to paste into Claude Code
or Claude Duet.

Keyboard: arrow keys decide, U undo, 1 to 5 weight, C note, N needs changes
first (PRs), O open on GitHub.

Settings has a "Leave these numbers out" list for items that don't belong in
the deck. It starts with #1727 (the www certificate fix, a GitHub Settings
change only you can make).

The export puts each call on one line: number, type, your call, weight, your
note, title, when you decided, when the item last changed, and the PR's head
commit.

## What it holds

Nothing. The files have no data or secrets. In your browser it reads public
issues and PRs from api.github.com and keeps your calls, notes and settings in
this browser's local storage only. Settings > "Forget everything on this
device" clears them.

An optional GitHub token (fine-grained, read-only, public repos) raises
GitHub's hourly limit. It is kept in this browser only and sent only to
api.github.com. By default it lasts until you close the tab.

## Files

- `index.html`, `styles.css`, `app.js`: the app (no build step)
- `manifest.webmanifest`, `icon.svg`: so it can be added to the home screen
- `test/demo-items.json`: sample data for `?demo`. Public issue text only, but
  it isn't needed on the live site and can be left out.

## Hosting

It lives in its own small public repo, kept apart from the Everything
Morgantown site repo so it never shows up on the site or runs through its
builds and checks. GitHub Pages serves the repo root (Settings > Pages >
Deploy from a branch > main, folder / (root)), so `index.html` sits at the top
of the repo. No build step and no Actions workflow are needed. Any other static
host works too.
