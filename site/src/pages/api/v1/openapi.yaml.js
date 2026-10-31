// /api/v1/openapi.yaml: describes the API files, made from the same v1 shape (#72).
import YAML from 'yaml';
import { openapi } from '../../../lib/api.mjs';

export function GET() {
  return new Response(YAML.stringify(openapi(), { aliasDuplicateObjects: false }), { headers: { 'Content-Type': 'application/yaml; charset=utf-8' } });
}
