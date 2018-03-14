"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../data/db");
const path = require("path");
const fs_1 = require("fs");
let dbConnection;
const rootUrl = "https://www.mvrater.com";
const defaultUrl = ['/', '/theaters', '/upcoming'];
generate();
function generate(distFolder = 'dist/public/') {
    return __awaiter(this, void 0, void 0, function* () {
        dbConnection = yield db_1.db.openDbConnection();
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${yield getDocument()}
</urlset>`;
        const filename = path.join(distFolder, 'sitemap.xml');
        fs_1.writeFileSync(filename, xml);
        console.log('sitemap generate done');
        process.exit();
    });
}
function getDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield db_1.db.dbConnection.collection("yahooMovies")
            .find({}, { yahooId: 1, _id: 0 }).sort({ yahooId: -1 }).toArray();
        const movieUrls = movies.map(({ yahooId }) => `/movie/${yahooId}`);
        const theaters = yield db_1.db.dbConnection.collection("theaters").find({}, { name: 1, _id: 0 }).toArray();
        const theaterUrls = theaters.map(({ name }) => `/theater/${name}`);
        return defaultUrl.concat(movieUrls, theaterUrls).map(url => getSiteMapRow(`${rootUrl}${url}`)).join('');
    });
}
function getSiteMapRow(url, freq = 'daily') {
    return `<url>\n<loc>${url}</loc>\n<changefreq>${freq}</changefreq>\n</url>\n`;
}
//# sourceMappingURL=sitemapGenrator.js.map