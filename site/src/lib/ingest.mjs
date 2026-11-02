// Shared fetch for everything the build reads live (#71): calendar feeds
// (./feeds), meetings (./meetings), live numbers (./live-indicators) and the
// weather. Each one tries a few times with a growing pause, names us in the
// User-Agent, and gives up after a timeout, so a slow source never hangs the
// build. Callers fall back to their saved copy when this throws.
//
// Before reading anything, it checks the site's robots.txt (./robots.mjs) and
// skips a path the site asks robots to stay out of, throwing
// RobotsDisallowed. Redirects are followed one at a time so every address on
// the way is checked too. Policy: docs/operations/automated-reads.md.
import { robotsCheck, RobotsDisallowed } from './robots.mjs';

export const USER_AGENT = 'MonCountyCommunityHub/1.0 (+https://github.com/david-shortman/mon-county-community-hub)';
export { RobotsDisallowed };

const MAX_REDIRECTS = 5;

async function allowedOrThrow(url, fetchImpl) {
  const check = await robotsCheck(url, { userAgent: USER_AGENT, fetchImpl });
  if (!check.allowed) throw new RobotsDisallowed(url, check.reason);
}

// format: 'text' (iCal, RSS, HTML) or 'json'. fetchImpl is for tests.
export async function fetchWithRetry(url, { format = 'text', timeoutMs = 20_000, tries = 3, headers = {}, fetchImpl = fetch } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      let at = url;
      let res;
      for (let hop = 0; ; hop++) {
        await allowedOrThrow(at, fetchImpl);
        res = await fetchImpl(at, { redirect: 'manual', signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': USER_AGENT, ...headers } });
        const next = res.status >= 300 && res.status < 400 && res.headers.get('location');
        if (!next) break;
        if (hop >= MAX_REDIRECTS) throw new Error('too many redirects');
        at = new URL(next, at).href;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await (format === 'json' ? res.json() : res.text());
    } catch (err) {
      // robots.txt said no: asking again will not change that.
      if (err instanceof RobotsDisallowed) throw err;
      last = err;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw last;
}
