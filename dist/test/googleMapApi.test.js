"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const googleMapApi_1 = require("../thirdPartyIntegration/googleMapApi");
const location_1 = require("../models/location");
const assert = chai.assert;
const should = chai.should();
describe('googleMapApi', () => {
    describe('getGeoLocation', () => {
        it("should get geolocaiton", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield googleMapApi_1.getGeoLocation('台北市八德路四段138號B1(京華城購物中心地下一樓)');
                result.should.have.property('lat');
                result.should.have.property('lng');
                result.should.have.property('place_id');
            });
        });
        it("should not throw exception", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield googleMapApi_1.getGeoLocation('sdafsdadsfasdafsadf');
                result.should.eql(new location_1.default());
            });
        });
    });
});
//# sourceMappingURL=googleMapApi.test.js.map