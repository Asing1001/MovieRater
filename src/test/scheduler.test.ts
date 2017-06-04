import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { initScheduler } from '../backgroundService/scheduler';
import { systemSetting } from '../configs/systemSetting';
import * as nodeSchedule from 'node-schedule';

chai.use(sinonChai);
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('Scheduler', () => {
  let consoleSpy: sinon.SinonSpy, scheduleJobSpy: sinon.SinonSpy;
  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');
    scheduleJobSpy = sinon.spy(nodeSchedule, 'scheduleJob');
  })
  afterEach(() => {
    consoleSpy.restore();
    scheduleJobSpy.restore()
  })
  describe('initScheduler', () => {
    it('should log "[Scheduler] init" if enableScheduler=true', function () {
      systemSetting.enableScheduler = true;
      initScheduler();
      consoleSpy.calledWithExactly("[Scheduler] init").should.be.true;
      scheduleJobSpy.called.should.be.true;
    });

    it('console.log should not be call if enableScheduler=false', function () {
      systemSetting.enableScheduler = false;
      initScheduler();
      consoleSpy.notCalled.should.be.true;
      scheduleJobSpy.notCalled.should.be.true;
    });
  });
});