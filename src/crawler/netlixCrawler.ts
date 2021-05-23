import * as fetch from "isomorphic-fetch";
import * as cheerio from "cheerio";

export async function getHtmlOfNetflixMovieWithRatingInfo(): Promise<string> {
    try {
        const response = await fetch(`https://www.netflix.com/tw/browse/genre/34399`);
        const htmlOriginal = await response.text();
        const htmlWithoutHeaderFooter = removeHeaderFooter(htmlOriginal);
        const htmlWithRatingInfo = insertAdditionalRatingInfo(htmlWithoutHeaderFooter);
        return htmlWithRatingInfo;
    }
    catch (e) {
        console.error(e);
        return null
    }
}

function removeHeaderFooter(htmlOriginal: string): string {
    return htmlOriginal; // TODO: implementation
}

function insertAdditionalRatingInfo(htmlWithoutHeaderFooter: string): string {
    const $ = cheerio.load(htmlWithoutHeaderFooter);
    return '';
}
