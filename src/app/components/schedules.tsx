import * as React from 'react';
import Schedule from '../../models/schedule';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import { grey500 } from 'material-ui/styles/colors';
import TheaterCard from './theaterCard';

const theaterInfoStyle: React.CSSProperties = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
}

interface MovieDetailProps {
    schedules: Schedule[]
}

class Schedules extends React.Component<MovieDetailProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            schedulesWithDistance: []
        };
    }

    getSchedulesWithDistance() {
        let schedulesCopy = JSON.parse(JSON.stringify(this.props.schedules));
        getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = schedulesCopy.map((schedule) => {
                let { theaterExtension, theaterExtension: { location: { lat, lng } } } = schedule;
                theaterExtension.distance = getDistanceInKM(lng, lat, longitude, latitude);
                return Object.assign(schedule, { theaterExtension });
            }).sort(({ theaterExtension: { distance: distanceA } }, { theaterExtension: { distance: distanceB } }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance })
        }, () => {
            schedulesCopy.sort(({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) => a - b)
            this.setState({ schedulesWithDistance: schedulesCopy })
        });
    }

    componentDidMount() {
        this.getSchedulesWithDistance();
    }

    render() {
        return (
            <div className="col-xs-12">
                {this.state.schedulesWithDistance.map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension }, index) => {
                    return (
                        <div key={index} style={{ padding: ".6em 1em 0em 1em" }}>
                            <TheaterCard theater={theaterExtension} roomTypes={roomTypes}></TheaterCard>
                            <div style={{ color: 'grey' }}>
                                {timesStrings.map(time => <span style={{ marginRight: "1em", display: "inline-block" }} key={time}>{time}</span>)}
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    };
}

export default Schedules;