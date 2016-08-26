import {crawlImdb} from '../crawler/imdbCrawler';
import {db} from '../db';

db.openDbConnection().then(
    () => crawlImdb()
);