import { googleApiSetting } from '../configs/systemSetting'
import googleMapApi from "@google/maps";
import Location from '../models/location';

export function getGeoLocation(address): Promise<Location> {
    return new Promise((resolve, reject) => {
        let location = new Location();
        if (!address) {
            resolve(location);
        }
        var googleMapsClient = require('@google/maps').createClient({
            key: googleApiSetting.geoApiKey
        });
        googleMapsClient.geocode({
            address: address.split('(')[0],
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
            } else {
                console.warn(`address:${address} not found, json.status:${response.json.status}`)
            }
            resolve(location);
        });
    })
}