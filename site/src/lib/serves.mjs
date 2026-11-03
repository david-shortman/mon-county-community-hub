// The "Serves:" line on new issues (#1037). Every new issue names the persona
// (content/personas.yaml) or need (content/needs/) it serves, on a line like:
//   Serves: short-on-food, enough-food
// The Health check lists open issues opened on or after SERVES_SINCE that have
// no such line. Issues opened by the recurring checks themselves are skipped.
export const SERVES_SINCE = '2026-11-03';
export const SKIP_LABELS = ['checklist', 'source-check', 'source-changed', 'health'];

// The slugs named on an issue's "Serves:" line, or null if it has none.
export function servesLine(body) {
  const text = String(body ?? '');
  // An issue form renders the field as a "### Serves" heading, the answer below.
  const form = text.match(/^#{1,6}\s*serves\s*\n+\s*(\S.*)$/im);
  const m = form ?? text.match(/^[\s>*_-]*serves\s*[:*_]+\s*(.*)$/im);
  if (!m || /^_?no response_?$/i.test(m[1].trim())) return null;
  return m[1].split(/[,;]|\band\b/).map((s) => s.replace(/[`*_.]/g, '').trim().toLowerCase()).filter(Boolean);
}

// Issues that should have a "Serves:" line and do not, and lines that name
// nothing we know. `known` is a Set of persona and need slugs.
export function servesProblems(issues, known, since = SERVES_SINCE) {
  const missing = [];
  const unknown = [];
  for (const i of issues) {
    if (i.pull_request || String(i.created_at ?? '').slice(0, 10) < since) continue;
    if ((i.labels ?? []).some((l) => SKIP_LABELS.includes(l.name ?? l))) continue;
    if (i.user?.type === 'Bot') continue;
    const named = servesLine(i.body);
    if (!named) missing.push(i);
    else if (!named.some((s) => known.has(s) || s === 'project')) unknown.push({ issue: i, named });
  }
  return { missing, unknown };
}
