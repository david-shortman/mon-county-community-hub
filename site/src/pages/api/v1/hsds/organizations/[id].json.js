// /api/v1/hsds/organizations/<uuid>.json: one HSDS organization (#73).
import { hsds } from '../../../../../lib/hsds.mjs';

export function getStaticPaths() {
  return hsds().organizations.map((o) => ({ params: { id: o.id }, props: { record: o } }));
}
export function GET({ props }) {
  return new Response(JSON.stringify(props.record, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
