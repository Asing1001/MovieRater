import {mergeData} from '../crawler/mergeData'; 
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {db} from "../data/db";
import {systemSetting} from '../configs/systemSetting';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('mergeData', () => {
  describe('mergeData', () => {
    before(()=>{return db.openDbConnection(systemSetting.dbUrl)})
    it('should eventually fulfilled', function () {
      this.timeout(30000);
      return mergeData().should.eventually.fulfilled
    });
  });  
});