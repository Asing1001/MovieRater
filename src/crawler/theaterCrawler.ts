import * as fetch from 'isomorphic-fetch';
import * as FormData from 'form-data';
import Region from '../models/region';
import Theater from '../models/theater';
import { getCheerio$ } from '../helper/util';

const theaterListUrl = 'https://tw.movies.yahoo.com/theater_list.html';
export async function getTheaterList(): Promise<Theater[]> {
    console.time('getTheaterList');
    const regionList = await getRegionList();
    const promises = regionList.map(getTheaterListByRegion);
    const theaterList = [].concat(...(await Promise.all(promises)));
    console.timeEnd('getTheaterList');
    return theaterList;
}

export async function getTheaterListByRegion({ name: regionName, yahooRegionId }) {
    var form = new FormData();
    form.append('area', yahooRegionId);
    const request = new Request(theaterListUrl, {
        method: 'POST',
        body: form
    });
    const $ = await getCheerio$(request);
    const theaterList = Array.from($('#ymvthl tbody>tr')).map(theaterRow => {
        const $theaterRow = $(theaterRow);
        const theater: Theater = {
            name: $theaterRow.find('a').text(),
            url: $theaterRow.find('a').attr('href').split('*')[1],
            address: $theaterRow.find('td:nth-child(2)').contents()[0].nodeValue,
            phone: $theaterRow.find('em').text(),
            region: regionName
        };
        return theater;
    });
    return theaterList;
}

export async function getRegionList(): Promise<Region[]> {
    const $ = await getCheerio$(theaterListUrl);
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
