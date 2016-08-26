import pttCrawler from '../crawler/pttCrawler';
import {db} from '../db';

db.openDbConnection().then(
    () => pttCrawler()
);