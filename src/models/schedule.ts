export default class Schedule {
  lineMovieDbId?: string;
  lineTheaterId?: string;
  movieName?: string;
  theaterName?: string;
  theaterCity?: string;
  date?: string;             // YYYYMMDD
  timesStrings?: string[];   // ["14:30", "17:00"]
  roomTypes?: string[];      // ["數位 國"] or ["IMAX 英"]
}
