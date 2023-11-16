import Location from '../models/location';
import Schedule from './schedule';

export default class Theater {
  constructor(name = '', address = '') {
    this.name = name;
    this.address = address;
  }
  name: string;
  url?: string;
  address?: string;
  phone?: string;
  region?: string;
  subRegion?: string;
  regionIndex?: string;
  location?: Location;
  distance?: number;
  scheduleUrl?: string;
  schedules?: Schedule[];
}
