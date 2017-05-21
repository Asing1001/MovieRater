import * as React from 'react';
import * as moment from 'moment';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import FindResult from './findResult';
import Movie from '../../models/movie';
import Schedule from '../../models/schedule';
import { classifyArticle, requestGraphQL } from '../helper';
import LoadingIcon from './loadingIcon';
import TheaterCard from './theaterCard';


const nearbyIcon = <IconLocationOn />;

const theaterQuery = `{
    name,
    address,
    url,
    phone,
    subRegion,
    location {
      lat,
      lng,
    },
    schedules {
        movie {
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            runTime,
            director,
            actor,
            imdbID,
            yahooRating,
            imdbRating,
            relatedArticles {
            title
         }
       },
        timesValues,
        timesStrings,
        roomTypes,
    }
}`;

enum SortType {
    imdb = 0,
    yahoo = 1,
    tomato = 2,
    ptt = 3,
    releaseDate = 4
}

class TheaterDetail extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            theater: {
                schedules: []
            }
        };
    }

    getData(name) {
        this.setState({ isLoading: true });
        fetch(`/graphql?query={theaters(name:"${name}")${theaterQuery.replace(/\s+/g, "")}}`).then(res => {
            return res.json()
        })
            .then((json: any) => {
                this.setState({ theater: json.data.theaters[0], isLoading: false });
            });
    }

    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.match.params.name);
    }

    componentDidMount() {
        this.getData(this.props.match.params.name);
    }

    render() {
        return (
            <div>
                <LoadingIcon isLoading={this.state.isLoading} />
                <TheaterCard theater={this.state.theater}></TheaterCard>
                {
                    this.state.theater.schedules && this.state.theater.schedules.map((schedule: Schedule, index) => (
                        <Paper zDepth={2} key={index} className="row no-margin" style={{ marginBottom: '.5em' }}>
                            <div>
                                <FindResult movie={classifyArticle(schedule.movie)}></FindResult>
                            </div>
                            <div className="col-xs-12" style={{ color: 'grey' }}>
                                {schedule.timesStrings.map(time => <span style={{ marginRight: "1em", display: "inline-block" }} key={time}>{time}</span>)}
                            </div>
                        </Paper>
                    ))
                }
            </div>
        );
    }
}
export default TheaterDetail;