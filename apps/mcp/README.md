# Everything Morgantown MCP server

A small, read-only [MCP](https://modelcontextprotocol.io) server so AI tools (Claude Code, Claude Desktop and other MCP clients) can answer questions about Morgantown and Monongalia County, WV from Everything Morgantown's checked data, and cite it (#75, ADR 0003).

- **Read-only.** It reads the public data files at https://everythingmorgantown.org/api/v1/ and nothing else. No writes, no secrets, no accounts, no personal data.
- **Cites everything.** Every result carries its `sources` (web page and checked date), the oldest and newest checked dates, and `stale: true` with a note when a source was last checked over 6 months ago (the same rule the site uses).
- **Describes, never decides.** Tools say who a program is for in the source's words. They never say whether someone qualifies, and point to 211 when nothing matches.
- **No dependencies.** Plain Node.js 20 or newer. Nothing to install.
- **Costs nothing.** It runs on your own computer over stdio. There is no server to host.

## Tools

| Tool | What it does |
|---|---|
| `search_services` | Search programs and services by plain words and an optional topic (`money`, `food`, `health`, `housing`, `recycling` and others) |
| `get_organization` | One organization by id (like `west-virginia-211`) or name, with its programs |
| `upcoming_dates` | Upcoming deadlines and community dates, soonest first, with an optional topic and how many days ahead |
| `list_needs` | The needs register (#74): ranked, sourced problems. Empty until entries are published |
| `how_to_report_a_problem` | Where to report a wrong or missing listing, and where fixes are published |

## Set it up

You need [Node.js](https://nodejs.org) 20 or newer and a copy of this repository:

```sh
git clone https://github.com/david-shortman/mon-county-community-hub.git
```

**Claude Code:**

```sh
claude mcp add everything-morgantown -- node /path/to/mon-county-community-hub/apps/mcp/server.mjs
```

**Claude Desktop and other MCP clients** that use a JSON config (`mcpServers`):

```json
{
  "mcpServers": {
    "everything-morgantown": {
      "command": "node",
      "args": ["/path/to/mon-county-community-hub/apps/mcp/server.mjs"]
    }
  }
}
```

To read a local build instead of the live site, build the site (`npm ci && npm run build` in `site/`) and pass the folder: `node apps/mcp/server.mjs --base site/dist/api/v1`, or set `EM_API_BASE` to a folder or URL.

## Test it

```sh
cd site && npm run build   # the build also runs the smoke test
node apps/mcp/test/smoke.mjs                       # against site/dist/api/v1
node apps/mcp/test/smoke.mjs https://everythingmorgantown.org/api/v1/   # against the live site
```

The smoke test starts the server, lists the tools, calls each one, and fails if a result has no sources.

## Hosting later: options and costs

Today it runs only from a clone, which reaches fewer people than a hosted server. Hosting needs an outside account, so it is David's decision (ADR 0003, stage 2), and only on evidence that someone needs it.

| Option | Cost | Needs |
|---|---|---|
| Run it locally from a clone (now) | $0 | Node.js on the user's computer |
| Publish it to npm so people can run `npx` without cloning | Free for public packages | An npm account (David) |
| Host it over HTTP on Cloudflare Workers | Free tier with a daily request limit | A Cloudflare account (David) and a small HTTP wrapper |
| Host it on Vercel or Netlify functions | Free hobby tiers with usage limits | An account (David); some free tiers are for non-commercial use |

Prices and limits change and were not checked for this README. Check each provider's pricing page before deciding.
