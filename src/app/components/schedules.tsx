import * as React from 'react';
import Schedule from '../../models/schedule';
import { Link } from 'react-router';
import Chip from 'material-ui/Chip';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import CommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import CommunicationCall from 'material-ui/svg-icons/communication/call';


interface MovieDetailProps {
    schedules: Schedule[]
}

class Schedules extends React.Component<MovieDetailProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            schedulesWithDistance: this.props.schedules,
        };
    }

    getSchedulesWithDistance() {
        getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = this.props.schedules.map((schedule) => {
                const { theaterExtension: { location: { lat, lng } } } = schedule;
                return Object.assign({ distance: getDistanceInKM(lng, lat, longitude, latitude) }, schedule);
            }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance })
        });
    }

    componentWillMount() {
        this.getSchedulesWithDistance();
    }

    render() {
        return (
            <div className="col-xs-12">
                {this.state.schedulesWithDistance.map(({ timesStrings, theaterName, distance, theaterExtension: { phone } }) => {
                    return (
                        <div key={theaterName} style={{ padding: ".6em 1em 0em 1em" }}>
                            <h5 style={{ marginBottom: "-.2em", fontSize:"16px" }}>
                                {theaterName}
                                {distance && (<span> - <a href={`https://maps.google.com?q=${theaterName}`} style={{ fontSize: 'small' }}>{distance} km</a></span>)}
                            </h5>
                            <a style={{ marginLeft: "1px", fontSize: 'small' }} href={`tel:${phone}`}>{phone}</a>
                            <p>
                                {timesStrings.map(time => <span style={{ marginRight: "1em", display: "inline-block" }} key={time}>{time}</span>)}
                            </p>
                        </div>
                    )
                })}
            </div>
        );
    };
}

export default Schedules;