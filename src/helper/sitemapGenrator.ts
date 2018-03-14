import { db } from '../data/db';
import * as path from 'path';
import { writeFileSync } from 'fs';

let dbConnection;
const rootUrl = "https://www.mvrater.com";
const defaultUrl = ['/', '/theaters', '/upcoming']

generate();
async function generate(distFolder = 'dist/public/') {
    dbConnection = await db.openDbConnection();
    let xml =
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${await getDocument()}
</urlset>`;
    const filename = path.join(distFolder, 'sitemap.xml');
    writeFileSync(filename, xml);
    console.log('sitemap generate done');
    process.exit()
}

async function getDocument() {
    const movies = await db.dbConnection.collection("yahooMovies")
        .find({}, { yahooId: 1, _id: 0 }).sort({ yahooId: -1 }).toArray()
    const movieUrls = movies.map(({ yahooId }) => `/movie/${yahooId}`);
    const theaters = await db.dbConnection.collection("theaters").find({}, { name: 1, _id: 0 }).toArray()
    const theaterUrls = theaters.map(({ name }) => `/theater/${name}`);
    return defaultUrl.concat(movieUrls, theaterUrls).map(url => getSiteMapRow(`${rootUrl}${url}`)).join('');
}

function getSiteMapRow(url, freq = 'daily') {
    return `<url>\n<loc>${url}</loc>\n<changefreq>${freq}</changefreq>\n</url>\n`
}
