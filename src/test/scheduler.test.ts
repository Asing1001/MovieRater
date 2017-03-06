import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {db} from "../data/db";
import {initScheduler} from '../backgroundService/scheduler'; 

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('Scheduler', () => {
  describe('initScheduler', () => {
    before(()=>{return db.openDbConnection()})
    it('should init schedules without exception', function () {
      this.timeout(30000);
      return initScheduler()
    });
  });
});