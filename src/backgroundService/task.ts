import { getTheaterList } from '../crawler/theaterCrawler';
import { db } from '../data/db';
import Theater from '../models/theater';

export async function updateTheaterList() {
    const theaterList = await getTheaterList();
    return Promise.all(theaterList.map(theater => db.updateDocument({ name: theater.name }, theater, 'theaters')));
}