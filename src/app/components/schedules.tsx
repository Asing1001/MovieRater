import * as React from 'react';
import * as moment from 'moment';
import Schedule from '../../models/schedule';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import TheaterCard from './theaterCard';
import TimeList from './timeList';
import Chip from 'material-ui/Chip';
import { grey500 } from 'material-ui/styles/colors';

const theaterInfoStyle: React.CSSProperties = {
  marginRight: '0.5em',
  fontSize: 'small',
  alignItems: 'center',
  display: 'inline-flex',
};

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

  getAvailableDates() {
    return [...new Set(this.props.schedules.map(({ date }) => date))];
  }

  setSchedulesWithDistance(schedules) {
    getClientGeoLocation().then(({ latitude, longitude }) => {
      const schedulesWithDistance = schedules
        .map((schedule) => {
          let {
            theaterExtension,
            theaterExtension: {
              location: { lat, lng },
            },
          } = schedule;
          return Object.assign({}, schedule, {
            theaterExtension: {
              ...theaterExtension,
              distance: getDistanceInKM(lng, lat, longitude, latitude),
            },
          });
        })
        .sort(
          (
            { theaterExtension: { distance: distanceA } },
            { theaterExtension: { distance: distanceB } }
          ) => distanceA - distanceB
        );
      this.setState({ schedulesWithDistance });
    });
  }

  componentDidMount() {
    let schedules = this.props.schedules
      .slice()
      .sort(
        (
          { theaterExtension: { regionIndex: a } },
          { theaterExtension: { regionIndex: b } }
        ) => a - b
      );
    this.setState({ schedulesWithDistance: schedules }, () =>
      this.setSchedulesWithDistance(schedules)
    );
  }

  render() {
    return (
      <div className="col-xs-12">
        <div className="date-wrapper col-xs-12">
          {this.getAvailableDates().map((date, index) => (
            <Chip
              className="datebtn"
              backgroundColor={
                this.state.selectedDate === date ? grey500 : null
              }
              key={index}
              onClick={() => this.setState({ selectedDate: date })}
            >
              {moment(date).isSame(moment(), 'day')
                ? '今天'
                : moment(date).format('MM/DD')}
            </Chip>
          ))}
        </div>
        {this.state.schedulesWithDistance
          .filter(({ date }) => date === this.state.selectedDate)
          .map(
            (
              {
                timesStrings,
                theaterName,
                roomTypes,
                distance,
                theaterExtension,
                date,
              },
              index
            ) => {
              return (
                <p key={index} className="col-xs-12">
                  <TheaterCard
                    theater={theaterExtension}
                    roomTypes={roomTypes}
                  ></TheaterCard>
                  <TimeList
                    timesStrings={timesStrings}
                    greyOutExpired={moment(date).isSame(moment(), 'day')}
                  ></TimeList>
                </p>
              );
            }
          )}
      </div>
    );
  }
}

export default Schedules;
