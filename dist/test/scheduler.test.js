"use strict";
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var db_1 = require("../data/db");
var scheduler_1 = require('../backgroundService/scheduler');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('Scheduler', function () {
    describe('initScheduler', function () {
        before(function () { return db_1.db.openDbConnection(); });
        it('should init schedules without exception', function () {
            this.timeout(30000);
            return scheduler_1.initScheduler();
        });
    });
});
//# sourceMappingURL=scheduler.test.js.map