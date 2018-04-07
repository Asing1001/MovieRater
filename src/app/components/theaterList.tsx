import * as React from 'react';
import Paper from 'material-ui/Paper';
import TheaterCard from './theaterCard';
import Theater from '../../models/theater';
import LoadingIcon from './loadingIcon';
import { getClientGeoLocation, getDistanceInKM } from '../helper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { gql, graphql } from 'react-apollo';

const theatersQuery = gql`
query theatersQuery{
  theaters {
    name
    address
    url
    phone
    subRegion
    location {
      lat
      lng
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

@graphql(theatersQuery)
class TheaterList extends React.PureComponent<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            theaters: [],
            selectedSubRegion: defaultSubRegion
        };
    }

    componentWillReceiveProps = (nextprops) => {
        const { data: { loading, theaters } } = nextprops;
        if (!loading) {
            this.setState({ theaters }, () => this.setTheatersWithDistance(theaters));
        }
    }

    setTheatersWithDistance = (theaters) => {
        getClientGeoLocation().then(({ latitude, longitude }) => {
            const theatersWithDistance = theaters.map((theater: Theater) => {
                const { location: { lat, lng } } = theater;
                return Object.assign({ distance: getDistanceInKM(lng, lat, longitude, latitude) }, theater);
            }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
            this.setState({ theaters: theatersWithDistance })
        });
    }

    handleChange = (event, index, selectedSubRegion) => this.setState({ selectedSubRegion });

    render() {
        const { data: { loading } } = this.props;
        if (loading) {
            return <LoadingIcon isLoading={loading} />
        }
        const subRegions = [...new Set(this.props.data.theaters.map(({ subRegion }) => subRegion))]
        return (
            <div>
                <div className="col-xs-12" style={{ padding: '0 1em' }}>
                    <SelectField
                        value={this.state.selectedSubRegion}
                        onChange={this.handleChange}
                    >
                        <MenuItem value={defaultSubRegion} primaryText={defaultSubRegion} />
                        {subRegions.map((subRegion, index) => <MenuItem key={index} value={subRegion} primaryText={subRegion} />)}
                    </SelectField>
                </div>
                {
                    this.state.theaters.filter(({ subRegion }) => this.state.selectedSubRegion === defaultSubRegion || subRegion === this.state.selectedSubRegion)
                        .map((theater: Theater, index) => (
                            <Paper key={index} zDepth={2} className="col-xs-12" style={{ padding: ".5em 1em" }}>
                                <TheaterCard theater={theater}></TheaterCard>
                            </Paper>
                        ))}
            </div>
        );
    }
}
export default TheaterList;