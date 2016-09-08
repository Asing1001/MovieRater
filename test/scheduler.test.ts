import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {db} from "../data/db";
import {systemSetting} from '../configs/systemSetting'; 
import {initScheduler} from '../backgroundService/scheduler'; 

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('Scheduler', () => {
  describe('yahooScheduler', () => {
    before(()=>{return db.openDbConnection(systemSetting.dbUrl)})
    it('should correctly get new data from yahoo', function () {
      this.timeout(30000);
      return initScheduler()
    });
  });
});