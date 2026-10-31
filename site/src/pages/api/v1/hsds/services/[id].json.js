// /api/v1/hsds/services/<uuid>.json: one HSDS service (#73).
import { hsds } from '../../../../../lib/hsds.mjs';

export function getStaticPaths() {
  return hsds().services.map((s) => ({ params: { id: s.id }, props: { record: s } }));
}
export function GET({ props }) {
  return new Response(JSON.stringify(props.record, null, 2) + '\n', { headers: { 'Content-Type': 'application/json' } });
}
