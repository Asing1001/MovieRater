import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import { getRegionList, getTheaterListByRegion } from '../crawler/theaterCrawler';
import Theater from "../models/theater";

chai.use(sinonChai);
const should = chai.should();


describe('theaterCrawler', () => {
  describe('getTheaterListByRegion(18)', () => {
    it('length.should.eq(1)', async function () {
      this.timeout(10000);
      let theaterList = await getTheaterListByRegion({ yahooRegionId: 18, name: "" });
      theaterList.length.should.eq(1);
    });
  });

  describe('getRegionList()', () => {
    it('length.should.above(0)', async function () {
      this.timeout(10000);
      let regionList = await getRegionList();
      regionList.length.should.above(0);
    });
  });
});