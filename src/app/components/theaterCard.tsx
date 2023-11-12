import * as React from 'react';
import Theater from '../../models/theater';
import { Link } from 'react-router-dom';
import SVGCommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import SVGAVWeb from 'material-ui/svg-icons/av/web';
import { grey500 } from 'material-ui/styles/colors';

const theaterCardStyle: React.CSSProperties = {
  marginRight: '0.5em',
  fontSize: 'small',
  alignItems: 'center',
  display: 'inline-flex',
};

class TheaterCard extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    let { url, distance, name, address } = this.props.theater;
    let roomTypes = this.props.roomTypes;
    return (
      <div>
        <Link style={{ color: 'inherit' }} to={`/theater/${name}`}>
          <h5 style={{ marginBottom: '-.2em', fontSize: '16px' }}>{name}</h5>
        </Link>
        <div style={{ paddingTop: '0.5em', display: 'flex', alignItems: 'center' }}>
          {url && (
            <a href={url} style={{ whiteSpace: 'nowrap', ...theaterCardStyle }}>
              <SVGAVWeb color={grey500} viewBox={'-3 0 30 24'} />
              線上購票
            </a>
          )}
          <a href={`https://maps.google.com?q=${name}`} style={theaterCardStyle}>
            <SVGCommunicationLocationOn color={grey500} viewBox={'-3 0 30 24'} />
            {distance ? `(${distance}km)${address}` : address}
          </a>
          {roomTypes && roomTypes.length > 0 && (
            <span className="roomType" style={theaterCardStyle}>
              {roomTypes.map((roomType) => roomType)}
            </span>
          )}
        </div>
      </div>
    );
  }
}
export default TheaterCard;
