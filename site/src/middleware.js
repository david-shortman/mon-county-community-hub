// Adds schema.org JSON-LD for the listings on each page (#37). Runs at build
// time for every page; endpoints (JSON, .ics, .txt) pass through untouched.
import { jsonLdForHtml, jsonLdScript } from './lib/jsonld.mjs';

export async function onRequest(_ctx, next) {
  const res = await next();
  const type = res.headers.get('content-type') ?? '';
  if (type && !type.includes('text/html')) return res;
  const html = await res.text();
  if (!html.includes('</head>')) return new Response(html, res);
  const ld = await jsonLdForHtml(html);
  const out = ld ? html.replace('</head>', `${jsonLdScript(ld)}</head>`) : html;
  return new Response(out, { status: res.status, statusText: res.statusText, headers: res.headers });
}
