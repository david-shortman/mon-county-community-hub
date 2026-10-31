// /api/v1/index.json: the catalog of the open data API (#72).
import { catalog } from '../../../lib/api.mjs';

export async function GET() {
  return new Response(JSON.stringify(await catalog(), null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
