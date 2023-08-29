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
import TimeList from './timeList';

const theaterDetailQuery = gql`
  query TheaterDetail($theaterName: String) {
    theaters(name: $theaterName) {
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
  }
`;

@graphql(theaterDetailQuery, {
  options: ({ match }) => {
    return {
      variables: {
        theaterName: decodeURI(match.params.name),
      },
    };
  },
})
class TheaterDetail extends React.PureComponent<
  any,
  { selectedDate: Date; }
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date()
    }
  }

  isSelectedDate(date) {
    return moment(date).isSame(this.state.selectedDate, 'date')
  }

  getAvailableDates(schedules) {
    return [...new Set(schedules.map(({ date }) => date))] as string[];
  }

  render() {
    const {
      data: { loading, theaters },
    } = this.props;
    if (loading) {
      return <LoadingIcon isLoading={loading} />;
    }
    const theater = theaters[0];
    document.title = `${theater.name}時刻表 | Movie Rater`;
    const availableDates = this.getAvailableDates(theaters[0].schedules);
    return (
      <div>
        <Paper zDepth={2} style={{ marginBottom: '.5em', padding: '.5em 1em' }}>
          <TheaterCard theater={theater}></TheaterCard>
          <div className="date-wrapper">
            {availableDates.map((date, index) => (
              <Chip
                className="datebtn"
                backgroundColor={
                  this.isSelectedDate(date) ? grey500 : null
                }
                key={index}
                onClick={() =>
                  this.setState({ selectedDate: new Date(date) })
                }
              >
                {moment(date).format('MM/DD')}
              </Chip>
            ))}
          </div>
        </Paper>
        {theater.schedules &&
          theater.schedules
            .slice()
            .filter(({ date }) => this.isSelectedDate(date))
            .sort(({ movie }, { movie: movie2 }) =>
              this.props.sortFunction(
                classifyArticle(movie),
                classifyArticle(movie2)
              )
            )
            .map((schedule: Schedule, index) => (
              <Paper
                zDepth={2}
                key={index}
                className="row no-margin"
                style={{ marginBottom: '.5em' }}
              >
                <MovieCard
                  movie={classifyArticle(schedule.movie)}
                  roomTypes={schedule.roomTypes}
                >
                  <TimeList
                    timesStrings={schedule.timesStrings}
                    greyOutExpired={moment(schedule.date).isSame(
                      moment(),
                      'day'
                    )}
                  ></TimeList>
                </MovieCard>
              </Paper>
            ))}
      </div>
    );
  }
}
export default TheaterDetail;
