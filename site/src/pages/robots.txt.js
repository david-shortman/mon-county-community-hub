export function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL(`${base}/sitemap-index.xml`, site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
