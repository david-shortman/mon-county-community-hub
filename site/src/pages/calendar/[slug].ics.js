// One small calendar file per entry, for the "Add to calendar" button.
// Phones open it straight into the calendar app.
import { loadCalendarWithFeeds, todayYmd } from '../../lib/content.mjs';
import { icsDocument, icsResponse } from '../../lib/ics.mjs';

export async function getStaticPaths() {
  const today = todayYmd();
  return (await loadCalendarWithFeeds())
    .filter((e) => e.ends >= today)
    .map((e) => ({ params: { slug: e.slug }, props: { e } }));
}

export function GET({ props }) {
  return icsResponse(icsDocument([props.e], props.e.title));
}
