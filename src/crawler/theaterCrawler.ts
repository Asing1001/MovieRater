import * as fetch from 'isomorphic-fetch';
import * as FormData from 'form-data';
import Region from '../models/region';
import Theater from '../models/theater';
import { getCheerio$ } from '../helper/util';

const theaterListUrl = 'http://www.atmovies.com.tw/showtime/';
export async function getTheaterList(): Promise<Theater[]> {
    console.time('getTheaterList');
    const regionList = await getRegionList();
    const promises = regionList.map(getTheaterListByRegion);
    const theaterList = [].concat(...(await Promise.all(promises)));
    console.timeEnd('getTheaterList');
    return theaterList;
}

export async function getRegionList(): Promise<Region[]> {
    const $ = await getCheerio$(theaterListUrl);
    const regionList = Array.from($('map > [shape=rect]')).map((area) => {
        const $area = $(area);
        return {
            name: $area.attr('alt'),
            regionId: $area.attr('href').substr(10, 3),
        };
    });

    //remove first option "選擇地區"
    regionList.shift();
    return regionList;
}

export async function getTheaterListByRegion({ name: regionName, regionId }, index) {
    const $ = await getCheerio$(`${theaterListUrl}${regionId}/`);
    let theaterList:Theater[] = [];
    let subRegion = regionName;
    Array.from($('#theaterList>li')).forEach(li => {
        const $li = $(li);
        if ($li.hasClass('type0')) {
            subRegion = $li.text().trim().slice(0, -1);
        }
        else {
            const theaterInfo = $li.text().trim().replace(/\s+/g,',').split(',');
            theaterList.push({
                name: theaterInfo[0],
                url: $li.find('a[target]').attr('href').split('weblink=')[1],
                scheduleUrl: $li.find('a').attr('href'),
                address: theaterInfo[3],
                phone: theaterInfo[1],
                region: regionName,
                regionIndex: index,
                subRegion
            })
        }
    });

    return theaterList;
}
