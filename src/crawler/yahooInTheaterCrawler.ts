import { getCheerio$ } from '../helper/util';

const inTheaterUrl = 'https://tw.movies.yahoo.com/';
export async function getInTheaterYahooIds() {
    let yahooIds = [];
    try {
        const $ = await getCheerio$(inTheaterUrl);
        yahooIds = Array.from($('select.auto[name="id"]').find('option[value!=""]')).map((index, ele) => parseInt($(ele).val()));
    } catch (error) {
        console.error(error);
    }
    return yahooIds;
}