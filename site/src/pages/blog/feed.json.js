// /blog/feed.json: the blog as JSON Feed 1.1, full text, newest first (#1703).
import { loadPosts } from '../../lib/blog.mjs';
import { jsonFeed } from '../../lib/blog-feeds.mjs';

export async function GET({ site }) {
  const origin = new URL(import.meta.env.BASE_URL.replace(/\/$/, ''), site).href.replace(/\/$/, '');
  return new Response(`${JSON.stringify(jsonFeed(await loadPosts(), origin), null, 2)}\n`, { headers: { 'Content-Type': 'application/feed+json; charset=utf-8' } });
}
