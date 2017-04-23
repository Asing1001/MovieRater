import Location from '../models/location';

export default class Theater {
    constructor({ name = "", address = "" }) {
        this.name = name;
        this.address = address;
    }
    name: string
    url?: string
    address?: string
    phone?: string
    region?: string
    location?: Location
}