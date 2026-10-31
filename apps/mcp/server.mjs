#!/usr/bin/env node
// Everything Morgantown MCP server (#75, ADR 0003). Read-only.
//
// It answers only from the project's public data files (/api/v1/ on the
// site) and returns every record with its sources and checked dates, so the
// AI tool using it can cite them. It has no writes, no secrets, no user data,
// and no outside dependencies. It talks MCP over stdio: one JSON-RPC message
// per line on stdin and stdout.
//
// Data location: EM_API_BASE, or --base <url-or-folder>. Defaults to the live
// site. A folder (like site/dist/api/v1) reads a local build.
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const argBase = process.argv.indexOf('--base');
const BASE = (argBase > 0 ? process.argv[argBase + 1] : process.env.EM_API_BASE) || 'https://everythingmorgantown.org/api/v1/';
const SERVER = { name: 'everything-morgantown', version: '1.0.0' };
const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const STALE_DAYS = 183;
const SITE = 'https://everythingmorgantown.org';
const REPORT_FORM = 'https://github.com/david-shortman/mon-county-community-hub/issues/new';
const NOTE = 'Data from public sources, gathered by Everything Morgantown (CC BY 4.0). Details change: check the source before acting, and send people to the group itself. This tool describes programs; it never decides who qualifies.';

// ---------- data ----------
const cache = new Map();
async function getJson(file) {
  if (cache.has(file)) return cache.get(file);
  const p = (async () => {
    if (/^https?:\/\//.test(BASE)) {
      const res = await fetch(new URL(file, BASE.endsWith('/') ? BASE : `${BASE}/`), { signal: AbortSignal.timeout(20_000) });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`could not load ${file}: HTTP ${res.status}`);
      return res.json();
    }
    try {
      return JSON.parse(await fs.readFile(path.join(BASE, file), 'utf8'));
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  })();
  cache.set(file, p);
  p.catch(() => cache.delete(file));
  return p;
}

const todayYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
const days = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

// Freshness, the same rule the site uses: a record is as old as its oldest source.
function freshness(sources = []) {
  const dates = sources.map((s) => s.checked).filter(Boolean).sort();
  const oldest = dates[0];
  const stale = oldest ? days(oldest, todayYmd()) > STALE_DAYS : true;
  return {
    sources,
    oldest_checked: oldest ?? null,
    newest_checked: dates.at(-1) ?? null,
    stale,
    ...(stale ? { stale_note: 'Stale: a source was last checked over 6 months ago. Treat these details as possibly out of date and check the source.' } : {}),
  };
}

const words = (s) => String(s ?? '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
function score(text, query) {
  const hay = String(text).toLowerCase();
  return words(query).reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
}

// ---------- tools ----------
const TOOLS = [
  {
    name: 'search_services',
    description: 'Search programs and services in Morgantown and Monongalia County, WV (food, bills, health care, housing, recycling and more). Returns matching listings with phone, link, who it is for, and the sources and checked dates to cite. Data comes from public sources and should be checked before acting. It describes programs and never decides who qualifies.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Plain words, like "help paying electric bill" or "free dental"' },
        topic: { type: 'string', description: 'Optional topic tag, like money, food, health, housing, recycling' },
        limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Most results to return (default 8)' },
      },
    },
    async run({ query = '', topic, limit = 8 }) {
      const [resources, orgs] = await Promise.all([getJson('resources.json'), getJson('orgs.json')]);
      const orgBySlug = new Map((orgs ?? []).map((o) => [o.slug, o]));
      let hits = (resources ?? []).filter((r) => !topic || (r.topics ?? []).includes(topic));
      if (query.trim()) {
        hits = hits
          .map((r) => ({ r, n: score([r.title, r.who_it_is_for, r.what_to_do, (r.topics ?? []).join(' '), orgBySlug.get(r.org)?.name].join(' '), query) }))
          .filter((x) => x.n > 0)
          .sort((a, b) => b.n - a.n || a.r.title.localeCompare(b.r.title))
          .map((x) => x.r);
      }
      const results = hits.slice(0, Math.min(Math.max(Number(limit) || 8, 1), 25)).map((r) => ({
        title: r.title,
        id: r.slug,
        organization: orgBySlug.get(r.org)?.name ?? r.org,
        organization_id: r.org,
        who_it_is_for: r.who_it_is_for,
        what_to_do: r.what_to_do,
        hours: r.hours,
        cost: r.cost,
        contact: r.contact,
        topics: r.topics,
        record: `${SITE}/api/v1/resources/${r.slug}.json`,
        ...freshness(r.sources),
      }));
      return { note: NOTE, count: results.length, results, ...(results.length ? {} : { hint: 'No listing matched. Suggest calling 211 (or texting your ZIP code to 898-211), which covers all of West Virginia.' }) };
    },
  },
  {
    name: 'get_organization',
    description: 'Get one organization in Morgantown or Monongalia County, WV, by its id (slug) or name, with its programs listed on Everything Morgantown. Every result includes sources and checked dates. Data comes from public sources and should be checked before acting.',
    inputSchema: {
      type: 'object',
      properties: { id_or_name: { type: 'string', description: 'An id like "west-virginia-211", or part of a name like "Health Right"' } },
      required: ['id_or_name'],
    },
    async run({ id_or_name }) {
      const [orgs, resources] = await Promise.all([getJson('orgs.json'), getJson('resources.json')]);
      const q = String(id_or_name ?? '').trim().toLowerCase();
      const o = (orgs ?? []).find((x) => x.slug === q)
        ?? (orgs ?? []).find((x) => x.name.toLowerCase() === q)
        ?? (orgs ?? []).map((x) => ({ x, n: score(x.name, q) })).filter((y) => y.n > 0).sort((a, b) => b.n - a.n)[0]?.x;
      if (!o) return { note: NOTE, found: false, message: `No organization matched "${id_or_name}". Try search_services with plain words.` };
      const programs = (resources ?? []).filter((r) => r.org === o.slug).map((r) => ({ title: r.title, id: r.slug, what_to_do: r.what_to_do, contact: r.contact, ...freshness(r.sources) }));
      return { note: NOTE, found: true, organization: { ...o, record: `${SITE}/api/v1/orgs/${o.slug}.json`, ...freshness(o.sources) }, programs };
    },
  },
  {
    name: 'upcoming_dates',
    description: 'List upcoming deadlines and community dates in Morgantown and Monongalia County, WV (application windows, tax dates, public meetings, mobile pantries, collection days), soonest first, with sources. Dates can change; check the source before acting.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Optional topic tag, like money, food, government, recycling, voting' },
        days: { type: 'integer', minimum: 1, maximum: 365, description: 'How many days ahead to look (default 60)' },
        limit: { type: 'integer', minimum: 1, maximum: 50, description: 'Most results to return (default 15)' },
      },
    },
    async run({ topic, days: ahead = 60, limit = 15 }) {
      const all = (await getJson('calendar.json')) ?? [];
      const today = todayYmd();
      const until = new Date(`${today}T12:00:00Z`);
      until.setUTCDate(until.getUTCDate() + Math.min(Math.max(Number(ahead) || 60, 1), 365));
      const untilYmd = until.toISOString().slice(0, 10);
      const hits = all
        .filter((e) => e.ends >= today && e.starts <= untilYmd && (!topic || (e.topics ?? []).includes(topic)))
        .sort((a, b) => a.starts.localeCompare(b.starts) || a.title.localeCompare(b.title))
        .slice(0, Math.min(Math.max(Number(limit) || 15, 1), 50))
        .map((e) => ({
          title: e.title, id: e.slug, starts: e.starts, ends: e.ends, start_time: e.start_time, end_time: e.end_time,
          org_name: e.org_name, who_it_is_for: e.who_it_is_for, what_to_do: e.what_to_do, url: e.url, place: e.place, phone: e.phone,
          topics: e.topics, from_feed: e.feed ? e.feed.name : undefined, ...freshness(e.sources),
        }));
      return { note: `${NOTE} Times are Eastern. Today in Morgantown is ${today}.`, count: hits.length, results: hits };
    },
  },
  {
    name: 'list_needs',
    description: 'List the needs register: ranked, sourced problems people in Mon County face, with public, aggregate evidence. Describes problems; takes no policy side.',
    inputSchema: { type: 'object', properties: {} },
    async run() {
      const needs = await getJson('needs.json');
      if (!needs?.length) return { note: NOTE, count: 0, results: [], message: 'No needs have been published yet. The register is being researched.' };
      return { note: NOTE, count: needs.length, results: [...needs].sort((a, b) => a.rank - b.rank).map((n) => ({ ...n, ...freshness(n.evidence) })) };
    },
  },
  {
    name: 'how_to_report_a_problem',
    description: 'How to tell Everything Morgantown that a listing is wrong, out of date or missing, and where fixes are published. Optionally for one listing id.',
    inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'Optional listing id (slug) the problem is about' } } },
    async run({ id }) {
      const q = new URLSearchParams({ template: 'suggest-resource.yml', title: id ? `Problem with: ${id}` : 'Problem with a listing' });
      if (id) q.set('name', id);
      return {
        note: NOTE,
        report_form: `${REPORT_FORM}?${q}`,
        how: 'Open the form, say what is wrong and link a public page that shows the right information. The form is on GitHub: it needs a free GitHub account, and what is written there is public. Do not include anyone\'s private details.',
        corrections_page: `${SITE}/corrections/`,
        groups_page: `${SITE}/partners/`,
        urgent: 'For help right now, call or text 211. In a mental health crisis, call or text 988. In an emergency, call 911.',
      };
    },
  },
];

// ---------- MCP over stdio ----------
const send = (msg) => process.stdout.write(`${JSON.stringify(msg)}\n`);
const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

async function handle(msg) {
  const { id, method, params = {} } = msg;
  const isRequest = id !== undefined && id !== null;
  switch (method) {
    case 'initialize': {
      const asked = params.protocolVersion;
      return reply(id, {
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions: `${NOTE} Cite each record's sources and checked date. If a result says it is stale, say so. Point people to the group and to 211 for anything not listed.`,
      });
    }
    case 'ping':
      return reply(id, {});
    case 'tools/list':
      return reply(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema, annotations: { readOnlyHint: true, openWorldHint: true } })) });
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return fail(id, -32602, `Unknown tool: ${params.name}`);
      try {
        const result = await tool.run(params.arguments ?? {});
        return reply(id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], structuredContent: result, isError: false });
      } catch (err) {
        return reply(id, { content: [{ type: 'text', text: `Could not load the data: ${err.message}` }], isError: true });
      }
    }
    default:
      if (method?.startsWith('notifications/')) return undefined; // nothing to answer
      if (isRequest) return fail(id, -32601, `Method not found: ${method}`);
  }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return fail(null, -32700, 'Parse error'); }
  handle(msg).catch((err) => fail(msg.id ?? null, -32603, err.message));
});
