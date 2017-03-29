import * as chai from 'chai';
import {db} from "../data/db";
import {updateTheaterList} from '../backgroundService/task'; 
import Theater from '../models/theater';

const should = chai.should();

describe('task', () => {
  describe('updateTheaterList', () => {
    before(()=>{return db.openDbConnection()})
    // should not do real update db in unit test
    // it('should successful in 5 sec', async function () {
    //   this.timeout(5000);
    //   await updateTheaterList();
    //   return;
    // });

    it('db should have theaters length > 0', async function () {
      let theaters:Theater[] = await db.getCollection('theaters');
      theaters.length.should.above(0);
    });
  });
});