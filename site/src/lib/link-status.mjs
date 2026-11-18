// How the Health links check reads an answer from an outbound link (#1929).
//
// 404 and 410 mean the page is gone, so the link is broken. 401, 403, 429,
// 5xx and network errors are often bot blocking or a blip, so the link is
// only unverified.
//
// A few hosts answer the Health run with 404 for pages that load fine for
// people. On 2026-11-14 and 2026-11-15 six fda.gov pages came back 404 in
// the Health run, while the same pages answered 200 to HEAD and GET from a
// Claude Code session, and their titles matched the cited pages. So for
// these hosts a 404 is unverified, with a note to open the link by hand.
// It is still listed on every run, so a page that really moved is not
// hidden: a person opening the link sees it.
//
// Add a host here only with that kind of evidence, and say where it is.
export const HOSTS_THAT_404_ROBOTS = new Map([
  ['www.fda.gov', 'fda.gov answers some automated checks with 404 while the page loads for people (#1929)'],
]);

// Returns { kind: 'ok' | 'broken' | 'unverified', note? }.
export function linkStatus(url, status) {
  if (status >= 200 && status < 400) return { kind: 'ok' };
  if (status === 404 || status === 410) {
    let host = '';
    try { host = new URL(url).hostname.toLowerCase(); } catch { /* not a URL */ }
    const note = status === 404 ? HOSTS_THAT_404_ROBOTS.get(host) : undefined;
    if (note) return { kind: 'unverified', note: `${note}; open it by hand` };
    return { kind: 'broken' };
  }
  return { kind: 'unverified' };
}
