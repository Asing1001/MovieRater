import * as chai from 'chai';
import * as sinonChai  from 'sinon-chai';
import * as sinon from 'sinon';
import { getTheaterList, getRegionList, getTheaterListByRegion } from '../crawler/theaterCrawler';
import Theater from "../models/theater";

chai.use(sinonChai);
const should = chai.should();

function hello(name, cb) {
    cb("hello " + name);
}

describe("hello", function () {
    it("should call callback with correct greeting", function () {
        var cb = sinon.spy();

        hello("foo", cb);

        cb.should.have.been.calledWith("hello foo");
    });
});

describe('theaterCrawler', () => {
  describe('getTheaterListByRegion(18)', () => {
    it('length.should.eq(1)', async function () {
      this.timeout(10000);
      let theaterList = await getTheaterListByRegion({ yahooRegionId: 18 });
      theaterList.length.should.eq(1);
    });
  });

  describe('getTheaterList()', () => {
    it('length.should.above(0)', async function () {
      this.timeout(10000);
      let theaterList = await getTheaterList();
      theaterList.length.should.above(0);
    });
  });

  describe('getRegionList()', () => {
    it('length.should.above(0)', async function () {
      this.timeout(5000);
      let regionList = await getRegionList();
      regionList.length.should.above(0);
    });
  });
});