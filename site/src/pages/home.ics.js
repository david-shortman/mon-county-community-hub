// Home and adulting calendar feed (#1051): yearly deadlines, burning seasons,
// frost dates and upkeep tips, plus live recycling and LIEAP dates.
// See loadHomeFeed in ../lib/content.mjs.
import { loadHomeFeed } from '../lib/content.mjs';
import { icsDocument, icsResponse } from '../lib/ics.mjs';
import { HOME_FEED_NAME, HOME_FEED_DESCRIPTION } from '../lib/home-year.mjs';

export async function GET() {
  return icsResponse(icsDocument(await loadHomeFeed(), HOME_FEED_NAME, { description: HOME_FEED_DESCRIPTION }));
}
