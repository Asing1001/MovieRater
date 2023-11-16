import Movie from '../models/movie';
import theater from '../models/theater';

export default class Schedule {
  constructor(scheduleUrl = '', theaterName = '', timesStrings = [], theaterExtension = new theater()) {
    this.scheduleUrl = scheduleUrl;
    this.theaterName = theaterName;
    this.timesStrings = timesStrings;
    this.theaterExtension = theaterExtension;
  }
  scheduleUrl?: string;
  movie?: Movie;
  movieName?: string;
  theaterName?: string;
  level?: string;
  timesStrings?: string[];
  roomTypes?: string[];
  theaterExtension?: theater;
  date?: string;
}
