# 0003: A static, versioned JSON API on Pages first, and a read-only MCP server over it

Status: proposed, 2026-10-28

## Context

The charter calls for open data, APIs, and MCP servers so city offices, nonprofits, businesses, and other AI tools can use the same accurate information. We have no server and no budget, and every outside account needs David. GitHub Pages already serves our files with `Access-Control-Allow-Origin: *` and a 10 minute cache (checked 2026-10-28), so other websites can read them directly.

## Decision

1. **Stage 1, now: static JSON.** The build writes `/api/v1/` next to the site: an `index.json` catalog (schema version, license, build time), one list file per record type, one file per record, the HSDS export, and an `openapi.yaml` describing it. Also an `llms.txt` at the site root that tells AI tools what the data is and where to find it.
2. **Versioning.** Within `v1`, only add fields. Breaking changes go to `v2`, and `v1` stays published for at least 6 months. A contract test in CI compares each build's output shape with a saved copy.
3. **MCP server, stage 1.** `apps/mcp/` is a small read-only MCP server that fetches the static API. Tools return records with their sources and checked dates. It runs locally from a clone over stdio. No writes, no secrets, no user data.
4. **Stage 2, only on evidence of need.** Host the MCP server over HTTP, or add a queryable API, only when a partner asks for it or the static files get too big to fetch whole. Hosting needs an account, so David decides.

## Consequences

- Good: $0, no server to keep up, nothing to attack, and the API can never be out of step with the site because both come from the same build.
- Good: the MCP server is a thin layer, so it cannot invent facts the data does not have.
- Limit: no filtering on the server. Clients download a list and filter. Fine at our size.
- Limit: we cannot count API or MCP use from static files. The scoreboard must say so rather than estimate.
- Limit: a local-only MCP server reaches fewer people than a hosted one. That is the tradeoff for not needing an account.
- The URL will change if the site moves to a custom domain. `index.json` should name the canonical base URL so clients can follow.
