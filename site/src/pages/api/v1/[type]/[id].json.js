// /api/v1/<type>/<id>.json: one record (#72).
import { TYPES, records } from '../../../../lib/api.mjs';

export async function getStaticPaths() {
  const paths = [];
  for (const [type, t] of Object.entries(TYPES)) {
    for (const r of await records(type)) paths.push({ params: { type, id: r[t.id] }, props: { record: r } });
  }
  return paths;
}

export function GET({ props }) {
  return new Response(JSON.stringify(props.record, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
