// Rules for what a blog post may say (#1705), on top of the shape checks in
// blog.mjs. Posts link to live pages for facts that change, so a post that
// ages never sends anyone to an old phone number, hour or amount.
// Each rule returns messages naming the fix. Used by scripts/check-blog.mjs.
import fs from 'node:fs';
import path from 'node:path';

// Crisis lines may appear only as part of a link to one of these pages.
export const CRISIS_PAGES = ['/help/', '/stay-tonight/', '/tonight/', '/mental-health/', '/drugs-and-alcohol/'];
const OWNER_NAME = /\bdavid\b/i;
const PHONE = /\(?\b\d{3}\)?[-. ]\d{3}[-.]\d{4}\b|\b1-?800[-. ]?\d{3}[-. ]?\d{4}\b/;
const HOURS = /\b\d{1,2}(?::\d{2})?\s?(?:a\.?m\.?|p\.?m\.?)(?=\W|$)|\bnoon to\b|\bopen (?:daily|24 hours)\b/i;
const MONEY = /\$\s?\d/;
const INCOME_LIMIT = /\bincome (?:limit|cap)s?\b|\b\d{2,3}% of (?:the )?(?:federal )?poverty\b/i;
const CRISIS = /\b(?:211|988|911)\b/;
const STALE = /\b(?:now|currently|so far|to date)\b/i;
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const DATED = new RegExp(`\\b(?:${MONTHS}) \\d{1,2}(?:, \\d{4})?\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b|\\bthe week of\\b`, 'i');
// A sentence that asks readers to report something through GitHub.
const REPORT_WORDS = /\b(?:report|tell us|let us know|send us|fix|wrong|mistake|problem)\b/i;

// Markdown links in a body: { text, href, whole }.
const links = (body) => [...body.matchAll(/\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)].map((m) => ({ text: m[1], href: m[2], whole: m[0] }));
const stripCode = (body) => body.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
// Body text with link targets removed, so a URL's digits are not read as a phone or a date.
const prose = (body) => stripCode(body).replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, ' ');
const sentences = (text) => text.split(/(?<=[.!?])\s+|\n{2,}|\n(?=[-*#\d])/).map((s) => s.trim()).filter(Boolean);

// Problems with one post's text: `file` for messages, `data` its front matter,
// `body` its Markdown, `pageExists(path)` true when a site path is a page.
export function bodyProblems(file, data, body, { pageExists = () => true } = {}) {
  const out = [];
  const say = (m) => out.push(`${file}: ${m}`);
  const text = prose(body);
  const all = `${data?.title ?? ''}\n${data?.summary ?? ''}\n${text}`;

  if (PHONE.test(text)) say('has a phone number. Link to the page that lists it instead');
  if (HOURS.test(text)) say('has opening hours or a time of day. Link to the page that lists them instead');
  if (MONEY.test(text)) say('has a dollar amount. Link to the page that lists it instead');
  if (INCOME_LIMIT.test(text)) say('has an income limit. Link to the page that explains who qualifies instead');

  // 211, 988 and 911 only inside a link to a help or crisis page.
  const allowed = stripCode(body).replace(/\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g, (whole, t, href) => (CRISIS_PAGES.some((p) => href === p || href.startsWith(p)) ? ' ' : t));
  if (CRISIS.test(`${allowed}\n${data?.title ?? ''}\n${data?.summary ?? ''}`)) say(`names 211, 988 or 911 outside a link to a help page (${CRISIS_PAGES.join(', ')})`);

  if (OWNER_NAME.test(all)) say('names the owner. Posts say "the owner"');
  if (all.includes('—')) say('has an em dash');

  for (const s of sentences(text)) {
    const m = s.match(STALE);
    if (m && !DATED.test(s)) say(`"${m[0]}" goes stale without a date. Add a date to the sentence or reword: "${s.slice(0, 80)}"`);
  }

  for (const l of links(stripCode(body))) {
    if (!/^https?:\/\/(?:www\.)?github\.com\//i.test(l.href)) continue;
    const s = sentences(stripCode(body)).find((x) => x.includes(l.whole)) ?? l.text;
    if (/\/issues\/new\b/i.test(l.href) || REPORT_WORDS.test(s.replace(l.whole, l.text))) say(`asks readers to report through GitHub (${l.href}). Every post page already links the fix form; point readers there. GitHub links as sources are fine`);
  }

  for (const p of data?.pages ?? []) if (typeof p === 'string' && p.startsWith('/') && !pageExists(p)) say(`pages lists ${p}, which is not a page on the site`);
  for (const l of links(stripCode(body))) if (l.href.startsWith('/') && !l.href.startsWith('//') && !pageExists(l.href)) say(`links to ${l.href}, which is not a page on the site`);
  return out;
}

// True when a site path like /utility-bills/ has a page file in pagesDir.
export function pageFileExists(p, pagesDir) {
  const route = String(p ?? '').replace(/[?#].*$/, '');
  if (!route.startsWith('/') || route.includes('..')) return false;
  if (route === '/') return fs.existsSync(path.join(pagesDir, 'index.astro'));
  const bare = route.replace(/\/$/, '');
  return [path.join(pagesDir, bare, 'index.astro'), `${path.join(pagesDir, bare)}.astro`].some((f) => fs.existsSync(f));
}
