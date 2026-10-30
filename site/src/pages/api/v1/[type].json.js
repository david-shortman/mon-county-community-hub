// /api/v1/<type>.json: every record of one type (#72).
import { TYPES, records } from '../../../lib/api.mjs';

export function getStaticPaths() {
  return Object.keys(TYPES).map((type) => ({ params: { type } }));
}

export async function GET({ params }) {
  return new Response(JSON.stringify(await records(params.type), null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
