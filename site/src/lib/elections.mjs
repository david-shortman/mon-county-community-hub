// Elections from content/elections/ (#1365). Each file is one election; /vote/
// shows the one that is coming up or just happened, by the Morgantown date at
// build time, so the daily build moves it along with no edits.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR } from './content.mjs';

const YMD = /^\d{4}-\d{2}-\d{2}$/;
const ymd = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''));

// Throws (failing the build) when a field the page needs is missing or wrong.
export function checkElection(e, file) {
  const bad = (msg) => { throw new Error(`content/elections/${file}: ${msg}`); };
  for (const k of ['slug', 'name', 'polls', 'results_url']) if (!e[k]) bad(`missing ${k}`);
  for (const k of ['election_day', 'canvass', 'results_until']) if (!YMD.test(ymd(e[k]))) bad(`${k} must be a YYYY-MM-DD date`);
  if (e.register_by && !YMD.test(ymd(e.register_by))) bad('register_by must be a YYYY-MM-DD date');
  if (!/^https:\/\//.test(e.results_url)) bad('results_url must be an https link');
  if (!(ymd(e.election_day) < ymd(e.canvass) && ymd(e.canvass) <= ymd(e.results_until))) bad('dates must run election_day < canvass <= results_until');
  if (e.early_voting) {
    const ev = e.early_voting;
    if (!YMD.test(ymd(ev.from)) || !YMD.test(ymd(ev.to)) || !ev.resource) bad('early_voting needs from, to and resource');
    if (!(ymd(ev.from) <= ymd(ev.to) && ymd(ev.to) < ymd(e.election_day))) bad('early_voting must end before election_day');
  }
  if (!Array.isArray(e.sources) || !e.sources.length || e.sources.some((s) => !s.url || !YMD.test(ymd(s.checked)))) bad('every election needs sources with url and checked');
  return e;
}

export function loadElections() {
  const dir = path.join(CONTENT_DIR, 'elections');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).map((f) => {
    const e = checkElection(YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')), f);
    for (const k of ['election_day', 'canvass', 'results_until', 'register_by']) if (e[k]) e[k] = ymd(e[k]);
    if (e.early_voting) { e.early_voting.from = ymd(e.early_voting.from); e.early_voting.to = ymd(e.early_voting.to); }
    return e;
  }).sort((a, b) => a.election_day.localeCompare(b.election_day));
}

export const morgantownToday = (now = new Date()) => now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// The election to show today, and which part: 'before' through Election Day,
// 'after' until results_until. Null when none is coming up or just finished.
export function currentElection(today = morgantownToday(), elections = loadElections()) {
  const e = elections.find((x) => today <= x.results_until);
  if (!e) return null;
  return { ...e, phase: today <= e.election_day ? 'before' : 'after', earlyVotingOpen: !!e.early_voting && today <= e.early_voting.to, registrationClosed: !!e.register_by && today > e.register_by };
}

// "Tuesday, November 3"
export const longDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
