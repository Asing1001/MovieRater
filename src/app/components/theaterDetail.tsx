import * as React from 'react';
import Paper from 'material-ui/Paper';
import Schedule from '../../models/schedule';
import { classifyArticle, getClientGeoLocation, getDistanceInKM } from '../helper';
import LoadingIcon from './loadingIcon';
import TheaterCard from './theaterCard';
import MovieCard from './movieCard';
import { gql, graphql } from 'react-apollo';

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
            movie {
                yahooId
                posterUrl
                chineseTitle
                englishTitle
                releaseDate
                runTime
                director
                actor
                imdbID
                yahooRating
                imdbRating
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
                theaterName: match.params.name
            }
        }
    },
})
class TheaterDetail extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }
    

    render() {
        const { data: { loading, theaters } } = this.props;
        if (loading) {
            return <LoadingIcon isLoading={loading} />
        }
        let theater = theaters[0];        
        return (
            <div>
                <Paper zDepth={2} style={{ marginBottom: '.5em', padding: ".5em 1em" }}>
                    <TheaterCard theater={theater}></TheaterCard>
                </Paper>
                {
                    theater.schedules && theater.schedules.map((schedule: Schedule, index) => (
                        <Paper zDepth={2} key={index} className="row no-margin" style={{ marginBottom: '.5em' }}>
                            <div>
                                <MovieCard movie={classifyArticle(schedule.movie)}></MovieCard>
                            </div>
                            <div className="col-xs-9" style={{ color: 'grey' }}>
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