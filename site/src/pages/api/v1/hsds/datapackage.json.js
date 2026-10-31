// /api/v1/hsds/datapackage.json: describes the CSV tables, license CC BY 4.0 (#73).
import { license } from '../../../../lib/api.mjs';
import { datapackage } from '../../../../lib/hsds.mjs';

export function GET() {
  return new Response(JSON.stringify(datapackage(license()), null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
