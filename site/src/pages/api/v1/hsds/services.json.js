// /api/v1/hsds/services.json: HSDS 3.1 services, each with its organization (#73).
import { hsds } from '../../../../lib/hsds.mjs';

export function GET() {
  return new Response(JSON.stringify(hsds().services, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
