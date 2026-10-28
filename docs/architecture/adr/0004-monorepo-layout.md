# 0004: One repo with npm workspaces: `packages/` for shared code, `apps/` for extra surfaces, routes before apps

Status: proposed, 2026-10-28

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
5. **One deploy.** The Pages workflow builds `site/` at `/` and each web app into `/apps/<name>/`, then publishes them together.
6. **Move code in small steps.** `packages/data` starts with the loader and checker from `site/`. Feed adapters move after PR #53 is merged and has run for a while. Each move is its own PR in the owning lane.

## Consequences

- Good: every surface uses the same loader, schemas, and design pieces. One clone, one `npm ci`.
- Good: residents find tools in one site with one search and one navigation.
- Cost: a root `package.json` and workspace setup, and some imports change paths. Each move risks conflicts with open PRs, so moves are small and announced in an issue first.
- Limit: one Pages site means apps share one domain and one deploy. An app that needs its own domain or a server is a hosting decision for David.
