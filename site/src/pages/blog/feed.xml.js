// /blog/feed.xml: the blog as RSS 2.0, full text, newest first (#1703).
import { loadPosts } from '../../lib/blog.mjs';
import { rssXml } from '../../lib/blog-feeds.mjs';

export async function GET({ site }) {
  const origin = new URL(import.meta.env.BASE_URL.replace(/\/$/, ''), site).href.replace(/\/$/, '');
  return new Response(rssXml(await loadPosts(), origin), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
