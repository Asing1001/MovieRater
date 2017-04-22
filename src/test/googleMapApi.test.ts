import * as chai from 'chai';
import { getGeoLocation } from '../thirdPartyIntegration/googleMapApi';
import Location from '../models/location';

const assert = chai.assert;
const should = chai.should();

describe('googleMapApi', () => {
  describe('getGeoLocation', () => {
    it("should get geolocaiton", async function () {
      const result = await getGeoLocation('台北市八德路四段138號B1(京華城購物中心地下一樓)');
      result.should.have.property('lat')
      result.should.have.property('lng')
      result.should.have.property('place_id')
    });

    it("should not throw exception", async function () {
      const result = await getGeoLocation('sdafsdadsfasdafsadf');
      result.should.eql(new Location());
    });
  });
});