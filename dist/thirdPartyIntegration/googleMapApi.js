"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const systemSetting_1 = require("../configs/systemSetting");
const location_1 = require("../models/location");
function getGeoLocation(address) {
    return new Promise((resolve, reject) => {
        let location = new location_1.default();
        if (!address) {
            resolve(location);
        }
        var googleMapsClient = require('@google/maps').createClient({
            key: systemSetting_1.googleApiSetting.geoApiKey
        });
        googleMapsClient.geocode({
            address,
            region: 'tw'
        }, function (err, response) {
            if (err) {
                reject(err);
                console.error(err);
            }
            const results = response.json.results;
            if (results && results.length > 0) {
                const result = results[0];
                location.lat = result.geometry.location.lat;
                location.lng = result.geometry.location.lng;
                location.place_id = result.place_id;
            }
            else {
                console.warn(`address:${address} not found, json.status:${response.json.status}`);
            }
            resolve(location);
        });
    });
}
exports.getGeoLocation = getGeoLocation;
//# sourceMappingURL=googleMapApi.js.map