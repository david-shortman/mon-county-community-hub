// The blog (#1701, #1702): dated posts from content/blog/YYYY-MM-DD-<slug>.md.
// Each post is Markdown with YAML front matter (schema:
// content/schemas/blog-post.schema.json). Every post is its own PR labeled
// for:david and goes live only when David merges it. BLOG_DIR points the
// loader at a test fixture, so the pages can be built and checked with a
// sample post that never goes live.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { CONTENT_DIR, todayYmd, ymd } from './content.mjs';

export const TYPES = {
  'week-notes': 'Week notes',
  'how-it-works': 'How it works',
  'what-we-found': 'What we found',
  'new-on-the-site': 'New on the site',
  milestone: 'Milestone',
};
export const STALE_DAYS = 90;
export const AUTHOR_LINE = 'Drafted by Claude, an AI, from the public record. Read and approved by the owner before it went up.';

const FILE = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

export const blogDir = () => (process.env.BLOG_DIR ? path.resolve(process.env.BLOG_DIR) : path.join(CONTENT_DIR, 'blog'));

// Front matter and body from one file's text.
export function splitPost(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: null, body: text };
  return { data: YAML.parse(m[1]) ?? {}, body: m[2] };
}

// What is wrong with a post, as a list of messages (empty when it is fine).
export function postProblems(file, data) {
  const out = [];
  const f = FILE.exec(file);
  if (!f) return [`${file}: name it YYYY-MM-DD-<slug>.md`];
  if (!data) return [`${file}: needs YAML front matter between --- lines`];
  const date = ymd(data.date);
  if (!data.title || typeof data.title !== 'string') out.push(`${file}: needs a title`);
  if (!YMD.test(date ?? '')) out.push(`${file}: date must be YYYY-MM-DD`);
  else if (date !== f[1]) out.push(`${file}: date ${date} does not match the file name`);
  if (!TYPES[data.type]) out.push(`${file}: type must be one of ${Object.keys(TYPES).join(', ')}`);
  if (!data.summary || typeof data.summary !== 'string') out.push(`${file}: needs a summary (2 or 3 sentences)`);
  if (!Array.isArray(data.pages) || !data.pages.length || data.pages.some((p) => typeof p !== 'string' || !p.startsWith('/'))) out.push(`${file}: pages must list at least one site path, like /utility-bills/`);
  if (data.corrections != null && (!Array.isArray(data.corrections) || data.corrections.some((c) => !YMD.test(ymd(c?.date) ?? '') || !c.note))) out.push(`${file}: each correction needs a date (YYYY-MM-DD) and a note`);
  if (/—/.test(`${data.title} ${data.summary}`)) out.push(`${file}: title or summary has an em dash`);
  return out;
}

const addDays = (d, n) => { const t = new Date(`${d}T12:00:00Z`); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

let processor;
// Every post, newest first, with its body rendered to HTML. Throws on a bad post.
export async function loadPosts({ dir = blogDir(), today = todayYmd() } = {}) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');
  const errors = [];
  const posts = [];
  processor ??= await createMarkdownProcessor();
  for (const file of files) {
    const { data, body } = splitPost(fs.readFileSync(path.join(dir, file), 'utf8'));
    const problems = postProblems(file, data);
    if (problems.length) { errors.push(...problems); continue; }
    if (/—/.test(body)) { errors.push(`${file}: body has an em dash`); continue; }
    const date = ymd(data.date);
    const corrections = (data.corrections ?? []).map((c) => ({ date: ymd(c.date), note: c.note })).sort((a, b) => a.date.localeCompare(b.date));
    const { code } = await processor.render(body);
    posts.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title,
      date,
      type: data.type,
      typeLabel: TYPES[data.type],
      summary: data.summary,
      pages: data.pages,
      corrections,
      html: code,
      lastmod: [date, ...corrections.map((c) => c.date)].sort().pop(),
      stale: addDays(date, STALE_DAYS) < today,
    });
  }
  if (errors.length) throw new Error(`Blog posts need fixing (content/blog/):\n- ${errors.join('\n- ')}`);
  return posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
}
