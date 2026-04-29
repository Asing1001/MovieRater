import * as chai from 'chai';
import { getGeoLocation } from '../thirdPartyIntegration/googleMapApi';
import Location from '../models/location';

chai.should();

const liveIt = process.env.ENABLE_LIVE_CRAWLER_TESTS === 'true' ? it : it.skip;

describe('googleMapApi', () => {
  describe('getGeoLocation', () => {
    liveIt('should get geolocaiton', async function () {
      this.timeout(10000);
      const result = await getGeoLocation('台北市八德路四段138號B1(京華城購物中心地下一樓)');
      result.should.have.property('lat');
      result.should.have.property('lng');
      result.should.have.property('place_id');
    });

    liveIt('should not throw exception', async function () {
      this.timeout(10000);
      const result = await getGeoLocation('sdafsdadsfasdafsadf');
      result.should.eql(new Location());
    });
  });
});