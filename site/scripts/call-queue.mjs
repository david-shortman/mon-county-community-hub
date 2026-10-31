#!/usr/bin/env node
// The call queue (#164): listings that only a phone call can check, oldest
// first, with the public number, what to ask, and when they were last
// confirmed. Making the calls waits on David's decision about who calls and
// from what number (#156). This only builds the list; it contacts no one.
//
// A listing is in the queue when it has a public phone number and either:
//   - a robot cannot read any of its sources (every source is "manual" in
//     content/source-rules.yaml, like a Facebook page), or
//   - it is a place with no recent activity seen (content/places), or
//   - it was confirmed by phone before (`phone_confirmed`), so it stays on
//     the phone rotation.
//
// Usage (from site/): node scripts/call-queue.mjs [--md FILE]
//   npm run call-queue
import fs from 'node:fs';
import { loadDir, ymd, todayYmd, oldestChecked } from '../src/lib/content.mjs';
import { loadRules, ruleFor } from './check-sources.mjs';

const rules = loadRules().rules;
const manual = (url) => ruleFor(url, rules)?.group === 'manual';

const ASK = {
  places: 'Are you still open and holding events? What are your hours? Can people still rent the hall, and how do they book?',
  resources: 'Is this still offered? What are the hours? Who can use it, and what should people bring?',
  orgs: 'Is this still your main public number? What are your hours?',
  secondhand: 'Are you still open? What are your hours, and what do you take or sell?',
};

export function callQueue(today = todayYmd()) {
  const out = [];
  for (const dir of ['places', 'resources', 'orgs', 'secondhand']) {
    for (const r of loadDir(dir)) {
      const phone = r.contact?.phone ?? r.phone;
      if (!phone || /^\d{3}$/.test(String(phone))) continue; // no number, or a short code like 211
      const sources = r.sources ?? [];
      const why = [];
      if (sources.length && sources.every((s) => manual(s.url))) why.push('no source a robot can read');
      if (r.status === 'no-recent-activity') why.push('no recent activity seen');
      const confirmed = ymd(r.phone_confirmed);
      if (confirmed) why.push('on the phone rotation');
      if (!why.length) continue;
      const checked = oldestChecked(sources);
      const last = [confirmed, checked].filter(Boolean).sort().pop() ?? null;
      out.push({ file: `content/${r._file}`, name: r.title ?? r.name, phone: String(phone), ask: ASK[dir], confirmed, checked, last, why });
    }
  }
  return out.sort((a, b) => (a.last ?? '').localeCompare(b.last ?? '') || a.name.localeCompare(b.name));
}

export function queueMd(list, today = todayYmd()) {
  const L = [`# Calls to make`, '', `Generated ${today} by \`npm run call-queue\` in \`site/\` (#164). Oldest first. Public numbers only.`, '',
    'Making these calls waits on David: who calls, and from what number (#156). Never write down the name of the person who answers. After a call, set `phone_confirmed` (and `phone_confirmed_by`, the caller\'s initials) on the record, and fix anything that changed from the group\'s own page or the call.', ''];
  if (!list.length) return [...L, 'Nothing to call right now.', ''].join('\n');
  L.push('| Listing | Number | Last confirmed by phone | Sources checked | Why it is here | Ask |', '|---|---|---|---|---|---|');
  for (const c of list) L.push(`| ${c.name} (\`${c.file}\`) | ${c.phone} | ${c.confirmed ?? 'never'} | ${c.checked ?? 'never'} | ${c.why.join('; ')} | ${c.ask} |`);
  return [...L, ''].join('\n');
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain) {
  const md = queueMd(callQueue());
  const i = process.argv.indexOf('--md');
  if (i > 0) fs.writeFileSync(process.argv[i + 1], md);
  else process.stdout.write(md);
}
