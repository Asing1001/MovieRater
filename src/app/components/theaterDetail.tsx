import * as React from 'react';
import * as moment from 'moment';
import Paper from 'material-ui/Paper';
import Schedule from '../../models/schedule';
import Chip from 'material-ui/Chip';
import { classifyArticle } from '../helper';
import LoadingIcon from './loadingIcon';
import TheaterCard from './theaterCard';
import MovieCard from './movieCard';
import { gql, graphql } from 'react-apollo';
import { grey500 } from 'material-ui/styles/colors';

const theaterDetailQuery = gql`
query TheaterDetail($theaterName:String){
    theaters(name:$theaterName){
        name
        address
        url
        phone
        subRegion
        location {
            lat
            lng
        }
        schedules {
            date
            movie {
                yahooId
                posterUrl
                chineseTitle
                englishTitle
                releaseDate
                runTime
                directors
                actors
                imdbID
                yahooRating
                imdbRating
                types
                relatedArticles {
                    title
                }
            }
            timesValues
            timesStrings
            roomTypes
        }
    }
}`;

enum SortType {
    imdb = 0,
    yahoo = 1,
    tomato = 2,
    ptt = 3,
    releaseDate = 4
}

@graphql(theaterDetailQuery, {
    options: ({ match }) => {
        return {
            variables: {
                theaterName: decodeURI(match.params.name)
            }
        }
    },
})
class TheaterDetail extends React.PureComponent<any, {selectedDate: string, availableDates: string[]}> {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: null,
            availableDates: []
        };
    }

    getAvailableDates(schedules) {
        return [...new Set(schedules.map(({ date }) => date))] as string[];
    }

    componentWillReceiveProps = (nextprops) => {
        const { data: { loading, theaters } } = nextprops;
        if (!loading && theaters.length) {
          const availableDates = this.getAvailableDates(theaters[0].schedules)
          const newestAvailableDate = availableDates.find(date=> moment(date).isSameOrAfter(moment(), 'date'))
          this.setState({ availableDates, selectedDate: newestAvailableDate || availableDates[0] })
        }
    }

    render() {
        const { data: { loading, theaters } } = this.props;
        if (loading) {
            return <LoadingIcon isLoading={loading} />
        }
        let theater = theaters[0];
        document.title = `上映場次時刻表 - ${theater.name} | Movie Rater`;
        return (
            <div>
                <Paper zDepth={2} style={{ marginBottom: '.5em', padding: ".5em 1em" }}>
                    <TheaterCard theater={theater}></TheaterCard>
                    <div className="date-wrapper">
                        {this.state.availableDates
                            .map((date, index) =>
                                <Chip className="datebtn" backgroundColor={this.state.selectedDate === date && grey500} key={index} onClick={() => this.setState({ ...this.state, selectedDate: date })}>
                                    {moment(date).format('MM/DD')}
                                </Chip>)}
                    </div>
                </Paper>
                {
                    theater.schedules && theater.schedules.slice()
                        .filter(({ date }) => date === this.state.selectedDate)
                        .sort(({ movie }, { movie: movie2 }) => this.props.sortFunction(classifyArticle(movie), classifyArticle(movie2)))
                        .map((schedule: Schedule, index) => (
                            <Paper zDepth={2} key={index} className="row no-margin" style={{ marginBottom: '.5em' }}>
                                <MovieCard movie={classifyArticle(schedule.movie)} timesStrings={schedule.timesStrings} roomTypes={schedule.roomTypes}></MovieCard>
                            </Paper>
                        ))
                }
            </div>
        );
    }
}
export default TheaterDetail;
