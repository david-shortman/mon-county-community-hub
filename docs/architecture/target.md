# Target architecture: the next 6 to 12 months

Status: proposed, 2026-10-28.

The project is meant to grow into many websites, apps, tools, open data, APIs, and MCP servers. This page says how to do that without the system becoming hard to change, expensive, or untrustworthy. Today's state is in [README.md](README.md). The choices behind this page are in [adr/](adr/).

## The idea in one picture

```
                      +---------------------------------------------+
  Sources             |  1. Canonical data (content/, YAML in git)   |
  ---------           |  orgs  services  locations  events  needs    |
  agency pages  ----->|  metrics  findability                        |
  public feeds  --+   |  every record: sources[], checked, method    |
                  |   |  checked against JSON Schemas (schemas/)     |
                  |   +----------------------+-----------------------+
                  |                          |
                  +--> 2. Ingestion          |   packages/data: load, validate,
                       (packages/ingest)  ---+   normalize, export
                       feeds + watched pages     |
                       -> snapshots with         v
                          provenance        +----------------------------+
                                            | 3. One data bundle per build|
                                            |  /api/v1/*.json  (our JSON) |
                                            |  /api/v1/hsds/   (HSDS)     |
                                            |  /calendar.ics   (iCal)     |
                                            +---+-----------+--------+----+
                                                |           |        |
                                     4. Surfaces read only from the bundle
                                                |           |        |
                                          site/ and     apps/mcp   other people's
                                          apps/*        (MCP over  tools, 211s,
                                          (web pages,   the API)   city sites, AIs
                                          search)
```

Five rules hold the picture together:

1. **One source of truth.** Facts live once, in `content/`. Every page, feed, API file, and MCP answer is built from it.
2. **Contracts between layers.** Schemas define what a record is. The `/api/v1/` shape defines what surfaces may rely on. Change either only on purpose.
3. **Provenance on everything.** Every record says where it came from, when it was fetched or checked, and how.
4. **Static first.** Build files ahead of time and serve them from GitHub Pages. Add a server only when a real need cannot be met without one, and only with David's OK.
5. **Lanes for agents.** Each folder has an owner, generated files are never hand-edited, and shared files are split so parallel work does not collide.

## 1. Canonical data layer

**Keep YAML in git as the database.** It is readable, every change is reviewed in a PR, history is free, and agents and people can both edit it. A real database would add hosting, secrets, and backups for no gain at our size (hundreds to a few thousand records). Revisit past roughly 10,000 records or if non-GitHub editors need a form. See [ADR 0001](adr/0001-canonical-data-model.md).

**Record types, and the standard each one follows:**

| Type | Folder | Follows | Notes |
|---|---|---|---|
| Organization | `content/orgs/` | HSDS `organization` | Exists (empty) |
| Service | `content/resources/` (keep the folder name) | HSDS `service` | Exists (empty). Rename only if it starts to confuse |
| Location | `content/locations/` | HSDS `location` + `service_at_location` | New. Public places only (offices, pantries), never homes |
| Event or deadline | `content/calendar/` | iCalendar `VEVENT` | Exists. Add optional times, time zone, and place (#46) |
| Need | `content/needs/` | Our own shape, from the charter | New. The needs register (#44) |
| Metric | `content/metrics/` | Our own shape, each value tied to an official source | New, when "how are we doing" pages start (#15, #62) |
| Findability run | `content/findability/` | Our own shape | Exists in PR #65 |

**Schemas.** One JSON Schema per type in `content/schemas/`, with a schema version. The checker uses them, and so does every other tool. Prose in `content/README.md` explains them for people, but the schema is the contract.

**IDs.** Each record's ID is `<type>/<slug>`, like `orgs/mountaineer-food-bank`. Slugs never change and are never reused. Where a standard wants a UUID (HSDS), we derive one from the ID so it is the same on every build.

**Standards we export, not store.** We do not make people write HSDS or iCalendar by hand. The build turns YAML into:
- **HSDS 3.x JSON** and a **Tabular Data Package** (CSVs plus `datapackage.json` naming CC BY 4.0) for services (#36).
- **iCalendar** (`calendar.ics`, and later one feed per topic) for events.
- **Our own JSON** for everything, including needs and metrics that have no standard.

**The needs register** is data like everything else, so the site, the scoreboard, and the "what to build next" step all read the same list. Each need records evidence with sources, who is affected (as counts, never people), severity, trend, who is already working on it, and gaps. Only aggregate, public signals. No quotes from or profiles of private individuals.

**What stays out of `content/`:** anything whose license is stricter than CC BY (the 211 taxonomy, county GIS layers, ShareAlike lists), records about private people, and raw 311 requests. See the [open data playbook](../playbook/open-data.md).

## 2. Feeds and ingestion, with provenance

Three tiers already exist on paper (PR #53): live feed, watched page, hand-checked. The target keeps them and makes provenance the same across all three. See [ADR 0002](adr/0002-provenance-on-every-record.md).

**Provenance fields on every record:**

```yaml
sources:
  - url: https://example.wv.gov/lieap   # the page a person can check
    checked: 2026-10-28                 # date a person or agent confirmed it
    method: hand                        # hand | feed | watched-page
    fetched: 2026-10-28T10:17:00Z       # feed and watched-page only: when the machine got it
    feed: morgantown-city               # feed only: adapter id
```

Hand entries keep writing just `url` and `checked`; `method: hand` is the default. Feed records get the rest filled in by the loader.

**Where ingestion code lives.** Adapters move from `site/src/lib/feeds/` to `packages/ingest/` once PR #53 is merged and stable, so the API and MCP server can use the same records the site does. One adapter per file, found by folder listing rather than a shared array, so adding a feed never edits a shared line. This is a proposal for the Builder's lane, filed as an issue, not a refactor done today.

**Fetch at build time, or commit snapshots?** Today feeds are fetched during each build, with committed snapshots as a fallback. That is fine for one page. As more surfaces read feed data, a better split is: a scheduled job fetches feeds and commits normalized snapshots through a PR, and the build reads only from the repo. Tradeoff: one more PR a day, but every build is repeatable, every change to feed data shows up in a diff, and a feed that goes quiet becomes visible. Decide once there are five or more feeds.

**Feed health.** Each fetch records item count and result. A feed that returns zero items, fails three days running, or drops by more than half opens a `for:duet` issue. This belongs with the Watchdog lane.

## 3. Public read-only API and MCP server

See [ADR 0003](adr/0003-static-api-and-mcp.md).

**Stage 1: static JSON on Pages (now).** The build writes:

```
/api/v1/index.json          what is here, schema version, license, build time
/api/v1/orgs.json           all orgs
/api/v1/orgs/<slug>.json    one org
/api/v1/services.json       ... same pattern for services, locations, events, needs, metrics
/api/v1/hsds/               HSDS JSON and the Tabular Data Package
/api/v1/openapi.yaml        a description other tools can read
/calendar.ics               (already exists)
/llms.txt                   a short plain guide for AI tools: what this is, where the data is
```

GitHub Pages already sends `Access-Control-Allow-Origin: *` and caches for 10 minutes (checked 2026-10-28), so any website or app can read these files directly. Cost: $0. Limits: no query parameters (clients filter on their side, fine at our size), and no request counts.

**Versioning.** Inside `v1`, only add fields. Removing or renaming anything means `v2`, with `v1` kept for at least 6 months. A test compares each build's output shape with a saved copy so a break is caught in the PR.

**Stage 1 MCP server.** A small read-only MCP server in `apps/mcp/` that reads the static API over HTTPS. Tools such as `search_services`, `get_organization`, `upcoming_dates`, `list_needs`, and `how_to_report_a_problem`. Every answer carries the source URL and checked date so the AI using it can cite them. People run it from a clone (no package registry account needed). No writes, no secrets, no user data.

**Stage 2: hosted, only if needed.** Host the MCP server over HTTP, or add a real query API, only when there is evidence someone wants it (a partner asks, or the static files get too big to fetch whole). A free tier on a serverless host would likely cover it, but it needs an account, so it is David's call.

## 4. Many sites and apps in one repo

See [ADR 0004](adr/0004-monorepo-layout.md).

**Routes before apps.** Most new "apps" (a bill-help finder, a recycling guide, a bus-times page) should be pages inside the main site, sharing its layout, search, and navigation. Residents get one place to look. Make a separate app only when it needs a different framework, a different audience (an embeddable widget for a partner site), or a different release pace.

**Layout:**

```
content/              canonical data and schemas (no code)
  schemas/
packages/             shared code, used by more than one surface
  data/               load, validate, normalize, export (HSDS, iCal, JSON API)
  ingest/             feed adapters and watched-page readers
  ui/                 design tokens, base CSS, shared Astro components
site/                 the main hub site (stays at this path; moving it would conflict with every open PR)
apps/                 everything else that ships
  mcp/                the MCP server
  <name>/             each new app in its own folder
tools/                scripts agents run: site review, chronicle, findability checks
docs/
```

**npm workspaces** tie it together: one `npm ci` at the root, packages imported by name. No extra build tool until we feel the pain.

**One deploy.** GitHub Pages serves one site per repo, so the deploy workflow builds the main site at `/` and each app into its own subpath (`/apps/<name>/`), then publishes them together. If an app ever needs its own domain or a server, that is a hosting decision for David.

**Shared design system.** `packages/ui` holds colors, type, spacing, and the base components (cards, source lines, "report a problem"). The design rubrics review it once instead of per app.

## 5. Search

**Pagefind**, a static search tool that builds an index at build time and runs in the browser. No server, no account, works on Pages, small download, and the index covers every route in the site. If apps live under subpaths, one index can cover them all.

Searches stay in the browser, so we learn nothing about what people search for unless analytics counts it. If we count searches, count words in aggregate, drop anything that looks like a name, phone number, or address, and keep only terms searched by several people.

## 6. Analytics that respect privacy

The charter allows aggregate counts only. Duet is comparing options for David (#41).

Architecture rules, whatever tool is picked:
- One snippet in the shared layout, turned on by config, so it is in one place and easy to remove.
- No cookies, no fingerprinting, no IP addresses stored, no cross-site tracking.
- Count page views, tool uses, outbound clicks to partner sites (with tagged links, #40), and search terms as described above.
- Small counts (under 10) are not published, so no one can be singled out.

**API and MCP use cannot be counted while they are static files on Pages.** That is the main gap for the charter's "Use" level. Options when it matters: ask partners to report use, or put a tiny counting proxy in front (needs hosting, so David's call). We say this plainly on the scoreboard rather than guess.

## 7. Testing and CI

Layers, cheapest first. All run free on public-repo GitHub Actions.

| Check | When | Blocks merge? |
|---|---|---|
| Schema validation of every `content/` file, plus the rules in `content/README.md` (sources, dates, no em dashes, `org:` links resolve) | Every PR, every build | Yes |
| Unit tests for `packages/*` (Node's built-in test runner, no extra tools) | Every PR touching code | Yes |
| Site build | Every PR | Yes |
| API contract test: output shape matches the saved `v1` shape | Every PR | Yes |
| MCP smoke test: start the server, call each tool against a built bundle | PRs touching `apps/mcp` or `packages/data` | Yes |
| Automated accessibility (axe) on key pages | Every PR touching `site/` or `packages/ui` | Only on serious violations |
| Rubric review by Claude (proposed in PR #34) | PRs touching `site/` or `content/` | Per that PR |
| Link and source-change check (#16), stale entries (#8), feed health | Scheduled | No, opens issues |

Making checks "required" is a repo setting, so that part is David's.

**Single point of failure.** Everything depends on GitHub Actions (#66 showed this). The site stays up when Actions is down, but it stops updating. A note on the site saying when it was last built would at least make that visible to residents.

## 8. Secrets and cost boundaries

See [ADR 0006](adr/0006-hosting-cost-and-secrets.md).

- **The data, site, API, and MCP builds use no secrets.** If a feed or service needs a key, we do not use it until David decides.
- **The only secret** is the Claude token in the Claude workflow. It is never available to workflows that run code from pull requests.
- **Never in the repo:** keys, tokens, `.env` files. GitHub secret scanning should be on (a repo setting, so David's).
- **Cost today: $0.** Things that would cost money or need an account, all David's call: a custom domain (roughly $10 to $20 a year), hosted analytics, a hosted MCP or API, a package registry account, a paid data source.
- **Stay inside free limits:** keep the published site well under 1 GB, keep images small, and do not commit large raw data. Large public datasets are linked, or summarized into small files.

## 9. How agents work safely in the codebase

See [ADR 0005](adr/0005-agent-safety-and-ownership.md).

- **Folder ownership.** A table of folders and their owning lane (today's version is in [README.md](README.md)). Agents edit only their lane. For anything else, open an issue. When `packages/` exists, its owners are listed in a `CODEOWNERS` file so GitHub shows who owns what.
- **Contracts between layers.** Content producers (Duet, researchers) and code (builders) meet at the schema. Code and surfaces meet at `/api/v1/`. A change to either contract needs an ADR in `docs/architecture/adr/` and a schema version bump.
- **Generated files are marked** with a header comment and never edited by hand (feed snapshots, exports). Where it is cheap, CI runs the generator again and fails if the output differs from what was committed.
- **No shared lists.** Adapters, apps, and records are found by listing folders, not by editing one shared array or index. Appending to a shared file is the main cause of conflicts.
- **One file per log entry.** The coordinating session plans to split `docs/build-log.md` and `docs/decisions.md` into one file per entry. ADRs already work this way: one numbered file each, and the index is the folder listing. Build logs, decisions, and ADRs should share a naming pattern: `YYYY-MM-DD-<slug>.md`, with ADRs keeping their number.
- **Small PRs, one lane each.** Easier to review, easier to revert.

## Order of work

1. JSON Schemas and a shared `packages/data` loader and checker, which gives #8 its engine (#69).
2. Provenance fields made the same for hand and feed records (#70).
3. Feed adapters moved to `packages/ingest`, with feed health (#71, Builder's lane, after PR #53).
4. Static `/api/v1/` with a contract test, plus `llms.txt` (#72).
5. HSDS and Tabular Data Package export, after the #36 mapping (#73).
6. Needs register schema, ready for Duet's research in #44 (#74).
7. Read-only MCP server over the API (#75).
8. Pagefind search (#76).

## What this does not decide

- Which analytics tool (#41, David).
- A custom domain, and when (David).
- Whether to host anything beyond Pages (David, when there is a need).
- Whether ingestion commits snapshots daily or fetches at build time (decide at five feeds).

Last checked: 2026-10-28.
