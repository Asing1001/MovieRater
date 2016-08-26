import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../db";
import * as Q from "q";

const pttMovieBoardUrl = 'https://www.ptt.cc/bbs/movie';
export default function crawlPtt() {
    db.getCollection("pttPages").then(pages => {
        let pageIndexs: Array<number> = pages.map(({pageIndex}) => pageIndex)
        const promises = [];
        for (let i = 4480; i <= 4482; i++) {
            if (pageIndexs.indexOf(i) === -1) {
                const promise = crawlPttPage(i);
                promises.push(promise);
            }
        }

        Q.all(promises).then(
            (result) => {
                db.insertCollection(result, "pttPages")
                console.log(`new pttPages count:${result.length}, result:${JSON.stringify(result)}`);
            }
        );
    });
}

function crawlPttPage(index: number) {
    const defer = Q.defer();
    const pttPageUrl = `${pttMovieBoardUrl}/index${index}.html`;
    request(pttPageUrl, (error, r, html: string) => {
        if (error || !html) {
            return;
        }

        const $ = cheerio.load(html);
        const $articleInfoDivs = $('.r-ent');
        const articleInfos = Array.from($articleInfoDivs).map((articleInfoDiv) => {
            const $articleInfoDiv = $(articleInfoDiv);
            const articleInfo = {
                title: $articleInfoDiv.find('.title>a').text(),
                push: $articleInfoDiv.find('.nrec>.hl').text(),
                url: pttMovieBoardUrl + $articleInfoDiv.find('.title>a').attr('href'),
                date: $articleInfoDiv.find('.meta>.date').text(),
                author: $articleInfoDiv.find('.meta>.author').text()
            };
            return articleInfo;
        });
        const pageInfo = {
            pageIndex: index,
            url: pttPageUrl,
            articles: articleInfos
        }

        defer.resolve(pageInfo);
    })
    return defer.promise;
}