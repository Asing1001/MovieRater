import * as React from 'react';
import Schedule from '../../models/schedule';
import { Link } from 'react-router';
import Chip from 'material-ui/Chip';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import SVGCommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import SVGCommunicationCall from 'material-ui/svg-icons/communication/call';
import { grey500 } from 'material-ui/styles/colors';


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
                            <h5 style={{ marginBottom: "-.2em", fontSize: "16px" }}>
                                {theaterName}
                            </h5>
                            <a href={`tel:${phone}`}
                                style={{ marginRight: '0.5em', marginTop: '0.5em', fontSize: 'small', alignItems: 'center', display: 'inline-flex' }}>
                                <SVGCommunicationCall color={grey500} viewBox={'0 0 30 24'} />{phone}
                            </a>
                            {distance &&
                                (<a href={`https://maps.google.com?q=${theaterName}`}
                                    style={{ fontSize: 'small', alignItems: 'center', display: 'inline-flex' }}>
                                    <SVGCommunicationLocationOn color={grey500} viewBox={'-3 0 30 24'} />{distance} km
                                </a>)}
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