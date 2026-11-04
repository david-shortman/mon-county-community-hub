// Feeds for the blog (#1703): RSS 2.0 and JSON Feed 1.1, with the full post
// text, newest first. Links in a post's text are made absolute, since news
// readers show the text away from the site. Written by hand so the site needs
// no new package.
export const FEED_TITLE = 'Everything Morgantown blog';
export const FEED_DESCRIPTION = 'Dated posts about Everything Morgantown, a plain-language guide to Morgantown and Monongalia County, WV: week notes, how it works, what we found and what is new.';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Noon UTC, so the day is the same in every US time zone.
const at = (ymd) => new Date(`${ymd}T12:00:00Z`);

// href="/x/" and src="/x" become full URLs on the site.
export function absolutize(html, origin) {
  return String(html).replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => `${attr}="${origin}/${rest}"`);
}

const postUrl = (p, origin) => `${origin}/blog/${p.slug}/`;

export function rssXml(posts, origin) {
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${postUrl(p, origin)}</link>
      <guid isPermaLink="true">${postUrl(p, origin)}</guid>
      <pubDate>${at(p.date).toUTCString()}</pubDate>
      <category>${esc(p.typeLabel)}</category>
      <description>${esc(p.summary)}</description>
      <content:encoded><![CDATA[${absolutize(p.html, origin).replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`).join('\n');
  const newest = posts.map((p) => p.lastmod).sort().pop();
  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${origin}/blog/</link>
    <atom:link href="${origin}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
${newest ? `    <lastBuildDate>${at(newest).toUTCString()}</lastBuildDate>\n` : ''}${items ? `${items}\n` : ''}  </channel>
</rss>
`;
}

export function jsonFeed(posts, origin) {
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: FEED_TITLE,
    home_page_url: `${origin}/blog/`,
    feed_url: `${origin}/blog/feed.json`,
    description: FEED_DESCRIPTION,
    language: 'en-US',
    items: posts.map((p) => ({
      id: postUrl(p, origin),
      url: postUrl(p, origin),
      title: p.title,
      summary: p.summary,
      content_html: absolutize(p.html, origin),
      date_published: at(p.date).toISOString(),
      date_modified: at(p.lastmod).toISOString(),
      tags: [p.typeLabel],
    })),
  };
}
