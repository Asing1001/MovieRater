export default class Location {
  constructor(lat = '', lng = '', place_id = '') {
    this.lat = lat;
    this.lng = lng;
    this.place_id = place_id;
  }
  lat?: string;
  lng?: string;
  place_id?: string;
}
