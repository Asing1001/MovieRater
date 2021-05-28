// import * as fetch from "isomorphic-fetch";
// import * as cheerio from "cheerio";
import * as puppeteer from 'puppeteer';

export async function getHtmlOfNetflixMovieWithRatingInfo(): Promise<string> {
    try {
        // const response = await fetch(`https://www.netflix.com/tw/browse/genre/34399`);
        console.log('puppeteer launch');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log('page goto');
        await page.goto('https://www.netflix.com/tw/browse/genre/34399');
        await page.screenshot({ path: 'dist\\test\\netflix_test.png' });
        console.log('screenshot');
        await browser.close();
        // const htmlOriginal = await response.text();
        // const htmlWithoutHeaderFooter = removeHeaderFooter(htmlOriginal);
        // const htmlWithRatingInfo = insertAdditionalRatingInfo(htmlWithoutHeaderFooter);
        return '';
    }
    catch (e) {
        console.error(e);
        return null
    }
}

// function removeHeaderFooter(htmlOriginal: string): string {
//     return htmlOriginal; // TODO: implementation
// }

// function insertAdditionalRatingInfo(htmlWithoutHeaderFooter: string): string {
//     const $ = cheerio.load(htmlWithoutHeaderFooter);
//     let $list = $('.nm-collections-title nm-collections-link');
//     let $listTarget = $list.get();

//     let nameList = $('.nm-collections-title-name');

//     return '';
// }
