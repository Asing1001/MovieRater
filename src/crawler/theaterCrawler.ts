import * as fetch from 'isomorphic-fetch';
import * as cheerio from 'cheerio';
import * as FormData from 'form-data';
import Region from '../models/region';
import Theater from '../models/theater';

const theaterListUrl = 'https://tw.movies.yahoo.com/theater_list.html';
export async function getTheaterList(): Promise<Theater[]> {
    const regionList = await getRegionList();
    const promises = regionList.map(getTheaterListByRegion);
    const theaterList = [].concat(...(await Promise.all(promises)));
    return theaterList;
}

export async function getTheaterListByRegion({ yahooRegionId }) {
    var form = new FormData();
    form.append('area', yahooRegionId);
    const request = new Request(theaterListUrl, {
        method: 'POST',
        body: form
    });
    const $ = await get$(request);
    const theaterList = Array.from($('#ymvthl tbody>tr')).map(theaterRow => {
        const $theaterRow = $(theaterRow);
        const theater: Theater = {
            name: $theaterRow.find('a').text(),
            url: $theaterRow.find('a').attr('href'),
            address: $theaterRow.find('td:nth-child(2)').contents()[0].nodeValue,
            phone: $theaterRow.find('em').text(),
        };
        return theater;
    });
    return theaterList;
}

export async function getRegionList(): Promise<Region[]> {
    const $ = await get$(theaterListUrl);
    const regionList = Array.from($('#area>option')).map((option) => {
        const $option = $(option);
        return {
            name: $option.text(),
            yahooRegionId: $option.val(),
        };
    });

    //remove first option "選擇地區"
    regionList.shift();
    return regionList;
}

async function get$(request: Request | string) {
    const response = await fetch(request);
    const html = await response.text();
    return cheerio.load(html);
}
