"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const db_1 = require("../data/db");
const scheduler_1 = require("../backgroundService/scheduler");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('Scheduler', () => {
    describe('initScheduler', () => {
        before(() => { return db_1.db.openDbConnection(); });
        it('should init schedules without exception', function () {
            this.timeout(30000);
            return scheduler_1.initScheduler();
        });
    });
});
//# sourceMappingURL=scheduler.test.js.map