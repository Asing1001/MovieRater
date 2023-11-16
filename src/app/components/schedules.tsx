import * as React from 'react';
import * as moment from 'moment';
import Schedule from '../../models/schedule';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import TheaterCard from './theaterCard';
import TimeList from './timeList';
import Chip from 'material-ui/Chip';
import { grey500 } from 'material-ui/styles/colors';

interface MovieDetailProps {
  schedules: Schedule[];
}

class Schedules extends React.PureComponent<MovieDetailProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      schedulesWithDistance: [],
      selectedDate: this.getAvailableDates()[0],
    };
  }

  memoizedAvailableDates: string[] | null = null; // Memoization cache

  getAvailableDates() {
    if (this.memoizedAvailableDates === null) {
      this.memoizedAvailableDates = [...new Set(this.props.schedules.map(({ date }) => date))];
    }
    return this.memoizedAvailableDates;
  }

  setSchedulesWithDistance(schedules) {
    getClientGeoLocation().then(({ latitude, longitude }) => {
      const updatedSchedules = schedules.map((schedule) => {
        const { theaterExtension } = schedule;
        if (
          theaterExtension &&
          theaterExtension.location &&
          theaterExtension.location.lat &&
          theaterExtension.location.lng
        ) {
          const { lat, lng } = theaterExtension.location;
          return {
            ...schedule,
            theaterExtension: {
              ...theaterExtension,
              distance: getDistanceInKM(lng, lat, longitude, latitude),
            },
          };
        } else {
          return schedule; // If lat and lng are missing, return the original schedule
        }
      });

      // Sort the schedules by distance
      updatedSchedules.sort(
        ({ theaterExtension: { distance: distanceA } }, { theaterExtension: { distance: distanceB } }) =>
          distanceA - distanceB
      );

      // Batch the state update
      this.setState({ schedulesWithDistance: updatedSchedules });
    });
  }

  componentDidMount() {
    let schedules = this.props.schedules
      .slice()
      .sort(
        ({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) =>
          parseInt(a) - parseInt(b)
      );
    this.setState({ schedulesWithDistance: schedules }, () => this.setSchedulesWithDistance(schedules));
  }

  handleDateClick = (date) => {
    this.setState({ selectedDate: date });
  };

  render() {
    const availableDates = this.getAvailableDates();

    return (
      <div className="col-xs-12">
        <div className="date-wrapper col-xs-12">
          {availableDates.map((date, index) => (
            <Chip
              className="datebtn"
              backgroundColor={this.state.selectedDate === date ? grey500 : null}
              key={index}
              onClick={this.handleDateClick.bind(this, date)} // Avoid inline arrow functions
            >
              {moment(date).isSame(moment(), 'day') ? '今天' : moment(date).format('MM/DD')}
            </Chip>
          ))}
        </div>
        {this.state.schedulesWithDistance
          .filter(({ date }) => date === this.state.selectedDate)
          .map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension, date }, index) => {
            return (
              <div key={index} className="col-xs-12">
                <TheaterCard theater={theaterExtension} roomTypes={roomTypes}></TheaterCard>
                <TimeList timesStrings={timesStrings} greyOutExpired={moment(date).isSame(moment(), 'day')}></TimeList>
              </div>
            );
          })}
      </div>
    );
  }
}

export default Schedules;
