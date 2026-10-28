# 0004: One repo with npm workspaces: `packages/` for shared code, `apps/` for extra surfaces, routes before apps

Status: accepted by David, 2026-10-28 (one repo, GitHub Pages, apps on subpaths). Proposed 2026-10-28.

## Context

The project expects many websites and tools. Today there is one Astro site in `site/` with its own `package.json`, and code that other surfaces will need (the content loader, feed adapters) lives inside it. Separate repos would split the data from the code and multiply the setup each agent needs. GitHub Pages serves one site per repo.

## Decision

1. **Stay in one repo.**
2. **Layout:**
   - `content/`: data and schemas, no code.
   - `packages/data`: load, validate, normalize, and export content. The only code that reads `content/` directly.
   - `packages/ingest`: feed adapters and watched-page readers.
   - `packages/ui`: design tokens, base CSS, shared Astro components.
   - `site/`: the main hub site. It stays at this path, since moving it would conflict with every open PR.
   - `apps/<name>/`: any other surface, starting with `apps/mcp/`.
   - `tools/`: scripts agents run (reviews, chronicle, findability).
3. **npm workspaces** at the root. Packages are imported by name. No extra build tools until we need them.
4. **Routes before apps.** A new tool for residents is a page in `site/` unless it needs a different framework, audience, or release pace.
5. **One deploy, apps on subpaths.** The Pages workflow builds `site/` at `/` and each web app into `/apps/<name>/`, then publishes them together as one site. Each app sets its base path (in Astro, `base`) to its subpath. David chose this on 2026-10-28 because GitHub Pages costs nothing.
6. **Move code in small steps.** `packages/data` starts with the loader and checker from `site/`. Feed adapters move after PR #53 is merged and has run for a while. Each move is its own PR in the owning lane.

## Hosting more than one site from one repo

GitHub Pages gives each repo one site. That is why apps live on subpaths. If a later need does not fit on a subpath, there are two ways out, and neither one splits the code into separate repos:

| Option | How it works | Cost and accounts | When to use it |
|---|---|---|---|
| **Subpaths on one Pages site** (chosen) | One build puts every app under `/apps/<name>/` on the same domain | $0, no new accounts | Default for everything |
| **Deploy-only repos on Pages** | A workflow in this repo builds an app and pushes only the built files to a second repo that has Pages turned on. The second repo holds no source code | $0, but the push needs a token stored as a secret, so David decides | An app needs its own domain or must deploy on its own schedule |
| **Vercel, Netlify, or Cloudflare Pages** | These support monorepos directly: one hosting project per app, each pointed at its folder (`site/`, `apps/<name>/`) in this same repo. Each gets its own domain and preview links on PRs | Free tiers with limits, and an outside account, so David decides | An app needs a server function, or preview links become worth the account |

So the layout above stays the same whatever the host. Moving an app off a subpath changes its deploy setup and its base path, not where its code lives.

## Consequences

- Good: every surface uses the same loader, schemas, and design pieces. One clone, one `npm ci`.
- Good: residents find tools in one site with one search and one navigation.
- Cost: a root `package.json` and workspace setup, and some imports change paths. Each move risks conflicts with open PRs, so moves are small and announced in an issue first.
- Limit: one Pages site means apps share one domain and one deploy. A broken app build blocks the whole deploy, so the workflow should build each app as its own step and name the one that failed.
- Every app must use relative links or its base path. Hard-coded `/` links break on a subpath. A link check on the built site catches this.
- An app that needs its own domain or a server uses one of the options in the table above. That is a hosting decision for David.
