#!/usr/bin/env node
// Persona line for the scoreboard (#1037). Part of the monthly loop that keeps
// personas and needs current (docs/personas.md, "Monthly review").
//
// Prints one line with three counts, from files already in the repo:
//   - personas whose path passes (landing page exists, next steps one or two
//     taps away), using the same check as check-personas.mjs on site/dist;
//   - personas whose findability questions all pass in the latest run that
//     scored them (a total of 10 or more out of 15; 9 or less is a gap, as
//     content/findability/ files say);
//   - needs in content/needs/ with no persona, and needs with no page
//     (no `get_help` path).
// Reads only content/ and site/dist. No visitor data, no searches, no names.
//
// Usage (from site/, after npm run build): node scripts/persona-report.mjs
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { checkPersonas, siteGraph } from './check-personas.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const CONTENT = path.join(here, '../../content');
const DIST = path.join(here, '../dist');
export const PASS_TOTAL = 10;

const readYaml = (f) => YAML.parse(fs.readFileSync(f, 'utf8')) ?? {};
const day = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''));

// The latest total for each question across the findability runs, with the run date.
export function latestScores(runs) {
  const out = new Map();
  for (const run of [...runs].sort((a, b) => day(a.date).localeCompare(day(b.date)))) {
    for (const r of run.results ?? []) if (r?.id && Number.isFinite(Number(r.total))) out.set(r.id, { total: Number(r.total), date: day(run.date) });
  }
  return out;
}

// The counts behind the line. `pathOk(persona)` says whether its path passes,
// or is null when the site is not built.
export function personaCounts({ personas, needs, scores, pathOk }) {
  const withPath = personas.filter((p) => pathOk(p) === true).length;
  const pathChecked = personas.some((p) => pathOk(p) != null);
  const scored = personas.filter((p) => (p.questions ?? []).length && (p.questions ?? []).every((q) => scores.has(q)));
  const passing = scored.filter((p) => p.questions.every((q) => scores.get(q).total >= PASS_TOTAL));
  const served = new Set(personas.flatMap((p) => p.needs ?? []));
  const noPersona = needs.filter((n) => !served.has(n.slug)).map((n) => n.slug);
  const noPage = needs.filter((n) => !(n.get_help ?? []).some((g) => g?.path)).map((n) => n.slug);
  return { total: personas.length, withPath, pathChecked, scored: scored.length, passing: passing.map((p) => p.slug), failing: scored.filter((p) => !passing.includes(p)).map((p) => p.slug), noPersona, noPage };
}

export function personaLine(c, today, lastRun) {
  const path = c.pathChecked ? `${c.withPath} of ${c.total} personas pass the path check` : 'path check not run (build the site first)';
  const find = `${c.passing.length} of ${c.scored} scored personas pass every findability question (${PASS_TOTAL}+ of 15${lastRun ? `, runs up to ${lastRun}` : ''})`;
  const needs = `top needs with no persona: ${c.noPersona.length ? c.noPersona.join(', ') : 'none'}; with no page: ${c.noPage.length ? c.noPage.join(', ') : 'none'}`;
  return `Personas (${today}): ${path}; ${find}; ${needs}.`;
}

// The report lines, from content/ and site/dist (if built).
export function reportLines(today = new Date().toISOString().slice(0, 10)) {
  const raw = readYaml(path.join(CONTENT, 'personas.yaml'));
  const personas = Array.isArray(raw) ? raw : raw.personas ?? [];
  const needDir = path.join(CONTENT, 'needs');
  const needs = fs.readdirSync(needDir).filter((f) => f.endsWith('.yaml')).map((f) => readYaml(path.join(needDir, f)));
  const findDir = path.join(CONTENT, 'findability');
  const runs = fs.readdirSync(findDir).filter((f) => /^\d{4}-\d{2}-\d{2}.*\.yaml$/.test(f)).map((f) => readYaml(path.join(findDir, f)));
  const scores = latestScores(runs);
  const lastRun = [...scores.values()].map((s) => s.date).sort().at(-1);
  const graph = fs.existsSync(DIST) ? siteGraph(DIST) : null;
  const pathOk = (p) => (graph ? (p.gap ? false : checkPersonas([p], graph, today).errors.length === 0) : null);
  const c = personaCounts({ personas, needs, scores, pathOk });
  const lines = [personaLine(c, today, lastRun)];
  if (c.failing.length) lines.push(`Personas with a findability question under ${PASS_TOTAL}: ${c.failing.join(', ')}`);
  return lines;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) console.log(reportLines().join('\n'));
