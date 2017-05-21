import * as React from 'react';
import * as moment from 'moment';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import TheaterCard from './theaterCard';
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
            subRegions: [],
            isLoading: true,
            selectedSubRegion: defaultSubRegion
        };
    }

    getData(ids) {
        return requestGraphQL(`${theaterQuery}`).then((json: any) => {
            return this.setState({
                theaters: json.data.theaters,
                subRegions: [...new Set(json.data.theaters.map(({ subRegion }) => subRegion))],
                isLoading: false
            });
        });
    }

    componentDidMount() {
        this.getData(this.props.match.params.ids).then(this.getTheatersWithDistance);
    }

    getTheatersWithDistance = () => {
        getClientGeoLocation().then(({ latitude, longitude }) => {
            const theatersWithDistance = this.state.theaters.map((theater: Theater) => {
                const { location: { lat, lng } } = theater;
                return Object.assign({ distance: getDistanceInKM(lng, lat, longitude, latitude) }, theater);
            }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
            this.setState({ theaters: theatersWithDistance })
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
                        {this.state.subRegions.map((subRegion, index) => <MenuItem key={index} value={subRegion} primaryText={subRegion} />)}
                    </SelectField>
                </div>
                {
                    this.state.theaters.filter(({ subRegion }) => this.state.selectedSubRegion === defaultSubRegion || subRegion === this.state.selectedSubRegion)
                        .map((theater: Theater, index) => (
                            <TheaterCard key={index} theater={theater}></TheaterCard>
                        ))}
            </div>
        );
    }
}
export default TheaterList;