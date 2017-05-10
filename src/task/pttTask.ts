import { getPttPage } from '../crawler/pttCrawler';
import { db } from '../data/db';
import * as Q from "q";
import Article from '../models/article';
import PttPage from '../models/pttPage';

export async function updatePttArticles(howManyPagePerTime) {
    const range = await getCurrentCrawlRange(howManyPagePerTime);
    const pttPages = await getRangePttPages(range);
    updateMaxPttIndex(pttPages, range.startPttIndex);
    let pttArticles: Article[] = [].concat(...pttPages.map(({articles}) => articles));
    await Promise.all(pttArticles.map(pttArticle => db.updateDocument({ url: pttArticle.url }, pttArticle, "pttArticles")))
}

const crawlerStatusFilter = { name: "crawlerStatus" };
async function getCurrentCrawlRange(howManyPagePerTime) {
    const crawlerStatus = await db.getDocument(crawlerStatusFilter, "configs");
    const startPttIndex = crawlerStatus.maxPttIndex + 1;
    return { startPttIndex, endPttIndex: startPttIndex + howManyPagePerTime - 1 }
}

async function getRangePttPages({ startPttIndex, endPttIndex }) {
    const promises = [];
    for (let i = startPttIndex; i <= endPttIndex; i++) {
        const promise = getPttPage(i);
        promises.push(promise);
    }

    const results = await Q.allSettled(promises);
    let pttPages = [];
    results.forEach((result) => {
        if (result.state === "fulfilled") {
            var value = result.value;
            pttPages.push(value);
        } else {
            var reason = result.reason;
            console.error(reason);
        }
    });
    return pttPages;
}

function updateMaxPttIndex(pttPages, startPttIndex) {
    const pttIndexs = pttPages.map(({ pageIndex }) => pageIndex);
    let newMaxPttIndex = Math.max(...pttIndexs, startPttIndex);
    const alreadyCrawlTheNewest = newMaxPttIndex === startPttIndex;
    if (alreadyCrawlTheNewest) {
        newMaxPttIndex = newMaxPttIndex - 100 > 0 ? newMaxPttIndex - 100 : 1;
    }
    db.updateDocument(crawlerStatusFilter, { maxPttIndex: newMaxPttIndex }, 'configs');
    console.log(`new pttPages count:${pttPages.length}, newMaxPttIndex:${newMaxPttIndex}`);
}