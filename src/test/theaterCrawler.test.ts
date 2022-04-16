import * as chai from 'chai';
import { expect } from 'chai';
import * as sinonChai from 'sinon-chai';
import { getRegionList, getTheaterListByRegion } from '../crawler/theaterCrawler';

chai.use(sinonChai);
const should = chai.should();

describe('theaterCrawler', () => {
  describe('getTheaterListByRegion(a02)', () => {
    it('length.should.eq(1)', async function () {
      this.timeout(20000);
      let theaterList = await getTheaterListByRegion({ regionId: 'a01', name: "基隆" }, 1);
      expect(theaterList[0]).contain({"name":"基隆秀泰影城","url":"https://www.showtimes.com.tw/events?corpId=5","scheduleUrl":"/showtime/t02g04/a01/","address":"基隆市中正區信一路177號","phone":"(02)2421-2388","region":"基隆","regionIndex":1,"subRegion":"基隆"})
      theaterList.length.should.eq(1);
    });
  });

  describe('getRegionList()', () => {
    it('length.should.above(0)', async function () {
      this.timeout(60000);
      let regionList = await getRegionList();
      regionList.length.should.above(0);
    });
  });
});