// Adds schema.org JSON-LD for the listings on each page (#37), plus the
// site's name on the home page, each page's breadcrumb (#1044) and its oldest
// checked date as lastReviewed (#122). Runs at build
// time for every page; endpoints (JSON, .ics, .txt) pass through untouched.
import { jsonLdForHtml, jsonLdScript } from './lib/jsonld.mjs';
import { SITE_ORIGIN } from './lib/site-meta.mjs';

const HOME = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export async function onRequest(ctx, next) {
  const res = await next();
  const type = res.headers.get('content-type') ?? '';
  if (type && !type.includes('text/html')) return res;
  const html = await res.text();
  if (!html.includes('</head>')) return new Response(html, res);
  const ld = await jsonLdForHtml(html, { home: ctx.url.pathname === HOME || ctx.url.pathname === HOME + 'index.html', url: new URL(ctx.url.pathname.replace(/index\.html$/, ''), SITE_ORIGIN).href });
  const out = ld ? html.replace('</head>', `${jsonLdScript(ld)}</head>`) : html;
  return new Response(out, { status: res.status, statusText: res.statusText, headers: res.headers });
}
