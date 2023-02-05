import * as cheerio from 'cheerio';
import * as fetch from 'isomorphic-fetch';

export async function getCheerio$(request: Request | string) {
    const response = await fetch(request);
    const html = await response.text();
    return cheerio.load(html, { decodeEntities: false });
}
