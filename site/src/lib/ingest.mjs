// Shared fetch for everything the build reads live (#71): calendar feeds
// (./feeds), meetings (./meetings) and live numbers (./live-indicators).
// Each one tries a few times with a growing pause, names us in the
// User-Agent, and gives up after a timeout, so a slow source never hangs the
// build. Callers fall back to their saved copy when this throws.
export const USER_AGENT = 'MonCountyCommunityHub/1.0 (+https://github.com/david-shortman/mon-county-community-hub)';

// format: 'text' (iCal, RSS, HTML) or 'json'.
export async function fetchWithRetry(url, { format = 'text', timeoutMs = 20_000, tries = 3 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await (format === 'json' ? res.json() : res.text());
    } catch (err) {
      last = err;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw last;
}
