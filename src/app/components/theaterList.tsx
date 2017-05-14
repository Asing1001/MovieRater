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
import { Link } from 'react-router';
import SVGCommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import SVGCommunicationCall from 'material-ui/svg-icons/communication/call';
import { grey500 } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const nearbyIcon = <IconLocationOn />;

const theaterQuery = `{
  theaters {
    name,
    address,
    url,
    phone,
    subRegion,
    location {
      lat,
      lng,
    }
  } 
}`;

const theaterInfoStyle: React.CSSProperties = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
}
const defaultSubRegion = '全部地區';
class TheaterList extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            theaters: [],
            isLoading: true,
            subRegions: [],
            selectedSubRegion: defaultSubRegion
        };
    }

    getData(ids) {
        requestGraphQL(`${theaterQuery}`).then((json: any) => {
            this.setState({
                theaters: json.data.theaters,
                subRegions: [...new Set(json.data.theaters.map(({ subRegion }) => subRegion))],
                isLoading: false
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.params.ids);
    }

    componentDidMount() {
        this.getData(this.props.params.ids);
    }

    gettheatersWithDistance() {
        getClientGeoLocation().then(({ latitude, longitude }) => {
            const theatersWithDistance = this.props.schedules.map((schedule) => {
                const { theaterExtension: { location: { lat, lng } } } = schedule;
                return Object.assign({ distance: getDistanceInKM(lng, lat, longitude, latitude) }, schedule);
            }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
            this.setState({ theatersWithDistance })
        });
    }

    handleChange = (event, index, selectedSubRegion) => this.setState({ selectedSubRegion });

    render() {
        return (
            <div>
                <LoadingIcon isLoading={this.state.isLoading} />
                <div className="col-xs-12">
                    <SelectField
                        value={this.state.selectedSubRegion}
                        onChange={this.handleChange}
                    >
                        <MenuItem value={defaultSubRegion} primaryText={defaultSubRegion} />
                        {this.state.subRegions.map(subRegion => <MenuItem value={subRegion} primaryText={subRegion} />)}
                    </SelectField>
                </div>
                {
                    this.state.theaters.filter(({ subRegion }) => this.state.selectedSubRegion === defaultSubRegion || subRegion === this.state.selectedSubRegion)
                        .map(({ name, address, phone, }: Theater) => (

                            <Paper zDepth={1} className="col-xs-12" style={{ paddingBottom: '.5em' }}>
                                <div style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                                    <Link style={{ color: 'inherit' }} to={`/theater/${name}`}><h5 style={{ marginBottom: "-.2em", fontSize: "16px" }}>
                                        {name}
                                    </h5></Link>
                                    <div style={{ paddingTop: '0.5em', display: 'flex', alignItems: 'center' }}>
                                        <a href={`tel:${phone}`}
                                            style={{ whiteSpace: 'nowrap', ...theaterInfoStyle }}>
                                            <SVGCommunicationCall color={grey500} viewBox={'0 0 30 24'} />{phone}
                                        </a>
                                        <a href={`https://maps.google.com?q=${name}`}
                                            style={theaterInfoStyle}>
                                            <SVGCommunicationLocationOn color={grey500} viewBox={'-3 0 30 24'} />{address} (x.x km)
                                            </a>
                                    </div>
                                </div>
                            </Paper>
                        ))}
            </div>
        );
    }
}
export default TheaterList;