import * as React from 'react';
import Schedule from '../../models/schedule';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import { grey500 } from 'material-ui/styles/colors';
import TheaterCard from './theaterCard';
import TimeList from './timeList';

const theaterInfoStyle: React.CSSProperties = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
}

interface MovieDetailProps {
    schedules: Schedule[]
}

class Schedules extends React.PureComponent<MovieDetailProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            schedulesWithDistance: [],
            selectedDate: this.getAvailableDates()[0]
        };
    }

    getAvailableDates() {
        return [...new Set(this.props.schedules.map(({ date }) => date))];
    }

    setSchedulesWithDistance(schedulesCopy) {
        getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = schedulesCopy.map((schedule) => {
                let { theaterExtension, theaterExtension: { location: { lat, lng } } } = schedule;
                theaterExtension.distance = getDistanceInKM(lng, lat, longitude, latitude);
                return Object.assign(schedule, { theaterExtension });
            }).sort(({ theaterExtension: { distance: distanceA } }, { theaterExtension: { distance: distanceB } }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance })
        });
    }

    componentDidMount() {
        let schedulesCopy = JSON.parse(JSON.stringify(this.props.schedules));
        schedulesCopy.sort(({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) => a - b)
        this.setState({ schedulesWithDistance: schedulesCopy }, () => this.setSchedulesWithDistance(schedulesCopy));
    }

    render() {
        return (
            <div className="col-xs-12">
                {this.getAvailableDates().map(date => <button onClick={() => this.setState({ selectedDate: date })}>{date}</button>)}
                {this.state.schedulesWithDistance.filter(({ date }) => date === this.state.selectedDate).map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension }, index) => {
                    return (
                        <div key={index} style={{ padding: ".6em 1em 0em 1em" }}>
                            <TheaterCard theater={theaterExtension} roomTypes={roomTypes}></TheaterCard>
                            <TimeList timesStrings={timesStrings}></TimeList>
                        </div>
                    )
                })}
            </div>
        );
    };
}

export default Schedules;