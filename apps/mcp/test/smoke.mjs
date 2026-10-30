// Smoke test for the MCP server (#75). Starts the server against a built API
// folder (default ../../site/dist/api/v1), speaks MCP over stdio, lists the
// tools and calls each one. Exits 1 on any problem.
// Usage: node test/smoke.mjs [api-folder-or-url]
import { spawn } from 'node:child_process';
import path from 'node:path';
import readline from 'node:readline';

const here = path.dirname(new URL(import.meta.url).pathname);
const arg = process.argv[2];
const base = arg ? (/^https?:\/\//.test(arg) ? arg : path.resolve(arg)) : path.resolve(here, '../../../site/dist/api/v1');
const server = spawn(process.execPath, [path.join(here, '../server.mjs'), '--base', base], { stdio: ['pipe', 'pipe', 'inherit'] });
const pending = new Map();
readline.createInterface({ input: server.stdout }).on('line', (line) => {
  const msg = JSON.parse(line);
  pending.get(msg.id)?.(msg);
  pending.delete(msg.id);
});
let next = 1;
const call = (method, params) => new Promise((resolve, reject) => {
  const id = next++;
  const timer = setTimeout(() => reject(new Error(`${method} timed out`)), 10_000);
  pending.set(id, (m) => { clearTimeout(timer); resolve(m); });
  server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
});

const problems = [];
const expect = (ok, msg) => { if (!ok) problems.push(msg); };
try {
  const init = await call('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1' } });
  expect(init.result?.serverInfo?.name === 'everything-morgantown', 'initialize: wrong serverInfo');
  server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
  const list = await call('tools/list', {});
  const names = list.result?.tools?.map((t) => t.name) ?? [];
  for (const n of ['search_services', 'get_organization', 'upcoming_dates', 'list_needs', 'how_to_report_a_problem']) expect(names.includes(n), `tools/list: missing ${n}`);
  for (const t of list.result?.tools ?? []) expect(/check|source/i.test(t.description) || t.name === 'how_to_report_a_problem' || t.name === 'list_needs', `${t.name}: description should say to check sources`);

  const run = async (name, args) => {
    const r = await call('tools/call', { name, arguments: args });
    expect(r.result && !r.result.isError, `${name}: returned an error ${JSON.stringify(r.error ?? r.result?.content)}`);
    return r.result?.structuredContent ?? {};
  };
  const s = await run('search_services', { query: 'help paying electric bill' });
  expect(s.count > 0, 'search_services: no results for "help paying electric bill"');
  for (const r of s.results ?? []) expect(r.sources?.length && r.oldest_checked && typeof r.stale === 'boolean', `search_services: ${r.id} has no sources or checked date`);
  const o = await run('get_organization', { id_or_name: 'west-virginia-211' });
  expect(o.found && o.organization?.sources?.length, 'get_organization: west-virginia-211 not found with sources');
  const d = await run('upcoming_dates', { days: 365 });
  for (const e of d.results ?? []) expect(e.sources?.length, `upcoming_dates: ${e.id} has no sources`);
  const n = await run('list_needs', {});
  expect(Array.isArray(n.results), 'list_needs: no results list');
  const h = await run('how_to_report_a_problem', { id: 'wv-211' });
  expect(h.report_form?.startsWith('https://github.com/'), 'how_to_report_a_problem: no form link');
  const bad = await call('tools/call', { name: 'nope', arguments: {} });
  expect(bad.error, 'unknown tool should return an error');
  console.log(`MCP smoke test: ${names.length} tools; search found ${s.count}, ${d.count} dates in the next year, ${n.count} needs.`);
} catch (err) {
  problems.push(err.message);
} finally {
  server.kill();
}
if (problems.length) {
  console.error(`MCP smoke test failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
