import * as React from 'react';
import Theater from '../../models/theater';
import { Link } from 'react-router-dom';
import SVGCommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import SVGCommunicationCall from 'material-ui/svg-icons/communication/call';
import { grey500 } from 'material-ui/styles/colors';

const theaterCardStyle: React.CSSProperties = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
}

class TheaterCard extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        let { phone, distance, name, address } = this.props.theater;
        let roomTypes = this.props.roomTypes;
        return (
            <div>
                {/* <Link style={{ color: 'inherit' }} to={`/theater/${name}`}> */}
                    <h5 style={{ marginBottom: "-.2em", fontSize: "16px" }}>
                        {name}
                    </h5>
                {/* </Link> */}
                <div style={{ paddingTop: '0.5em', display: 'flex', alignItems: 'center' }}>
                    {roomTypes && roomTypes.length > 0 && <span style={theaterCardStyle}>
                        {roomTypes.map(roomType => <img key={roomType} src={`https://s.yimg.com/f/i/tw/movie/movietime_icon/icon_${roomType}.gif`} />)}
                    </span>}                    
                    {phone && <a href={`tel:${phone}`}
                        style={{ whiteSpace: 'nowrap', ...theaterCardStyle }}>
                        <span><SVGCommunicationCall color={grey500} viewBox={'0 0 30 24'} /></span>{phone}
                    </a>}
                    <a href={`https://maps.google.com?q=${name}`}
                        style={theaterCardStyle}>
                        <span><SVGCommunicationLocationOn color={grey500} viewBox={'-3 0 30 24'} /></span>{distance ? ` ${distance} km` : address}
                    </a>
                </div>
            </div>
        );
    }
}
export default TheaterCard;