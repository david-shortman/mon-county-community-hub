// /api/v1/hsds/organizations.json: HSDS 3.1 organizations, each with its services (#73).
import { hsds } from '../../../../lib/hsds.mjs';

export function GET() {
  return new Response(JSON.stringify(hsds().organizations, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
