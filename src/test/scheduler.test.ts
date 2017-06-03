import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { db } from "../data/db";
import { initScheduler } from '../backgroundService/scheduler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('Scheduler', () => {
  describe('initScheduler', () => {
    it('should init schedules without exception', function () {
      return initScheduler()
    });
  });
});