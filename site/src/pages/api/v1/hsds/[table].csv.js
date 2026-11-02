// /api/v1/hsds/<table>.csv: the Tabular Data Package tables (#73).
import { TABLE_NAMES, csv } from '../../../../lib/hsds.mjs';

export function getStaticPaths() {
  return TABLE_NAMES.map((table) => ({ params: { table } }));
}
export function GET({ params }) {
  return new Response(csv(params.table), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
