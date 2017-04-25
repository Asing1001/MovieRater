import Location from '../models/location';
import theater from '../models/theater';

export default class Schedule {
    constructor(yahooId = 0, theaterName = "", timesValues = [], timesStrings = [], theaterExtension = new theater()) {
        this.yahooId = yahooId;
        this.theaterName = theaterName;
        this.timesValues = timesValues;
        this.timesStrings = timesStrings;
        this.theaterExtension = theaterExtension;
    }
    yahooId?: number
    theaterName?: string
    timesValues?: string[]
    timesStrings?: string[]
    theaterExtension?: theater
}