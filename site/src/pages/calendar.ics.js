// iCalendar feed of every entry that has not ended yet.
import { loadCalendarWithFeeds, todayYmd } from '../lib/content.mjs';
import { icsDocument, icsResponse } from '../lib/ics.mjs';

export async function GET() {
  const today = todayYmd();
  return icsResponse(icsDocument((await loadCalendarWithFeeds()).filter((e) => e.ends >= today)));
}
