import * as React from 'react';
import Schedule from '../../models/schedule';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import SVGCommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import SVGCommunicationCall from 'material-ui/svg-icons/communication/call';
import { grey500 } from 'material-ui/styles/colors';

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
            schedulesWithDistance: this.props.schedules
                .sort(({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) => a - b),
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

    componentDidMount() {
        this.getSchedulesWithDistance();
    }

    render() {
        return (
            <div className="col-xs-12">
                {this.state.schedulesWithDistance.map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension: { phone } }, index) => {
                    return (
                        <div key={index} style={{ padding: ".6em 1em 0em 1em" }}>
                            <h5 style={{ marginBottom: "-.2em", fontSize: "16px" }}>
                                {theaterName}
                            </h5>
                            <div style={{ paddingTop: '0.5em', display: 'flex', alignItems: 'center' }}>
                                <span style={theaterInfoStyle}>
                                    {roomTypes.map(roomType => <img key={roomType} src={`https://s.yimg.com/f/i/tw/movie/movietime_icon/icon_${roomType}.gif`} />)}
                                </span>
                                <a href={`tel:${phone}`}
                                    style={theaterInfoStyle}>
                                    <SVGCommunicationCall color={grey500} viewBox={'0 0 30 24'} />{phone}
                                </a>
                                {distance &&
                                    (<a href={`https://maps.google.com?q=${theaterName}`}
                                        style={theaterInfoStyle}>
                                        <SVGCommunicationLocationOn color={grey500} viewBox={'-3 0 30 24'} />{distance} km
                                </a>)}
                            </div>
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