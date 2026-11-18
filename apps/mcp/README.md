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
| `upcoming_dates` | Upcoming deadlines and community dates, soonest first, with an optional topic and how many days ahead. Each date has an Add to calendar link (`.ics`). Chat apps that support MCP Apps show it as an interactive list (below) |
| `list_needs` | The needs register (#74): ranked, sourced problems. Empty until entries are published |
| `how_to_report_a_problem` | Where to report a wrong or missing listing, and where fixes are published |

## Interactive view (MCP Apps)

Chat apps that support [MCP Apps](https://github.com/modelcontextprotocol/ext-apps) can show `upcoming_dates` as a small list instead of text (#1371): each date with when and where, topic buttons to filter, and **Add to calendar**, **Source** and **Details** buttons. Other apps get a plain text list.

- The view is one file, [`views/upcoming-dates.html`](views/upcoming-dates.html), served as the resource `ui://everything-morgantown/upcoming-dates.html` (type `text/html;profile=mcp-app`). The tool links to it with `_meta.ui.resourceUri`, only when the chat app says it can show views (`io.modelcontextprotocol/ui` in its capabilities).
- It loads nothing from the internet. The chat app hands it the tool result, and links open through the chat app (`ui/open-link`). Add to calendar opens the date's `.ics` file on everythingmorgantown.org, which phones open in their calendar app.
- Read-only: no storage, no tracking, no accounts.
- Each date says how it was read and when: "Pulled from" a group's own calendar feed, or "Checked" by hand (#1371, ADR 0007). A date that starts in the next 14 days, from a source last read over 30 days ago, gets a **Check before you go** note. That is the upcoming-event rule in [`content/recheck-windows.yaml`](../../content/recheck-windows.yaml); the smoke test fails if the two drift apart. The tool's result has the same facts as `read_how`, `read_from`, `days_since_checked` and `check_first`, and the plain text answer says them too.

To use it in Claude or ChatGPT, the server has to be reachable online first (hosting is David's decision, #1370). The smoke test checks that the view is linked, has the right type and loads no outside files.

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
