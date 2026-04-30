import * as cheerio from 'cheerio';

export async function getCheerio$(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  return cheerio.load(html, { decodeEntities: false });
}
