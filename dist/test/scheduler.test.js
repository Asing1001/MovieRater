"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const scheduler_1 = require("../backgroundService/scheduler");
const systemSetting_1 = require("../configs/systemSetting");
const nodeSchedule = require("node-schedule");
chai.use(sinonChai);
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
describe('Scheduler', () => {
    let consoleSpy, scheduleJobSpy;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
        scheduleJobSpy = sinon.spy(nodeSchedule, 'scheduleJob');
    });
    afterEach(() => {
        consoleSpy.restore();
        scheduleJobSpy.restore();
    });
    describe('initScheduler', () => {
        it('should log "[Scheduler] init" if enableScheduler=true', function () {
            systemSetting_1.systemSetting.enableScheduler = true;
            scheduler_1.initScheduler();
            consoleSpy.calledWithExactly("[Scheduler] init").should.be.true;
            scheduleJobSpy.called.should.be.true;
        });
        it('console.log should not be call if enableScheduler=false', function () {
            systemSetting_1.systemSetting.enableScheduler = false;
            scheduler_1.initScheduler();
            consoleSpy.notCalled.should.be.true;
            scheduleJobSpy.notCalled.should.be.true;
        });
    });
});
//# sourceMappingURL=scheduler.test.js.map