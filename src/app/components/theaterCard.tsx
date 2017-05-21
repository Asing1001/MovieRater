import * as React from 'react';
import * as moment from 'moment';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import FindResult from './findResult';
import Theater from '../../models/theater';
import { classifyArticle, requestGraphQL } from '../helper';
import LoadingIcon from './loadingIcon';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import { Link } from 'react-router-dom';
import SVGCommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import SVGCommunicationCall from 'material-ui/svg-icons/communication/call';
import { grey500 } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const nearbyIcon = <IconLocationOn />;

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
        let {phone,distance,name,address} = this.props.theater;
        return (<Paper zDepth={2} className="col-xs-12" style={{ paddingBottom: '.5em' }}>
            <div style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                <Link style={{ color: 'inherit' }} to={`/theater/${name}`}><h5 style={{ marginBottom: "-.2em", fontSize: "16px" }}>
                    {name}
                </h5></Link>
                <div style={{ paddingTop: '0.5em', display: 'flex', alignItems: 'center' }}>
                    <a href={`tel:${phone}`}
                        style={{ whiteSpace: 'nowrap', ...theaterCardStyle }}>
                        <SVGCommunicationCall color={grey500} viewBox={'0 0 30 24'} />{phone}
                    </a>
                    <a href={`https://maps.google.com?q=${name}`}
                        style={theaterCardStyle}>
                        <SVGCommunicationLocationOn color={grey500} viewBox={'-3 0 30 24'} />{address} {distance && ` (${distance} km)`}
                    </a>
                </div>
            </div>
        </Paper>
        );
    }
}
export default TheaterCard;