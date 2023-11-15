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
import Theater from '../../models/theater';

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
          movieBaseId
          lineUrlHash
          lineRating
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
class TheaterDetail extends React.PureComponent<any, { selectedIndex: number }> {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  isSelectedIndex(index: Number) {
    return this.state.selectedIndex === index;
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
    const theater: Theater = theaters[0];
    document.title = `${theater.name}時刻表 | 按IMDb/LINE/PTT評分排序`;
    document['meta'] = {
      description: generateTheaterDescription(theater),
    };
    const availableDates = this.getAvailableDates(theaters[0].schedules);
    return (
      <div>
        <Paper zDepth={2} style={{ marginBottom: '.5em', padding: '.5em 1em' }}>
          <TheaterCard theater={theater}></TheaterCard>
          <div className="date-wrapper">
            {availableDates.map((date, index) => (
              <Chip
                className="datebtn"
                backgroundColor={this.isSelectedIndex(index) ? grey500 : null}
                key={index}
                onClick={() => {
                  this.setState({ selectedIndex: index });
                }}
              >
                {moment(date).format('MM/DD')}
              </Chip>
            ))}
          </div>
        </Paper>
        {theater.schedules &&
          theater.schedules
            .slice()
            .filter(({ date }) => date === availableDates[this.state.selectedIndex])
            .sort(({ movie }, { movie: movie2 }) =>
              this.props.sortFunction(classifyArticle(movie), classifyArticle(movie2))
            )
            .map((schedule: Schedule, index) => (
              <Paper zDepth={2} key={index} className="row no-margin" style={{ marginBottom: '.5em' }}>
                <MovieCard movie={classifyArticle(schedule.movie)} roomTypes={schedule.roomTypes}>
                  <TimeList
                    timesStrings={schedule.timesStrings}
                    greyOutExpired={moment(schedule.date).isSame(moment(), 'day')}
                  ></TimeList>
                </MovieCard>
              </Paper>
            ))}
      </div>
    );
  }
}
export default TheaterDetail;

function generateTheaterDescription(theater: Theater) {
  const movieNames = theater.schedules
    ? [...new Set(theater.schedules.map(({ movie }) => movie.chineseTitle))].join('、')
    : null;
  return `${theater.name}．地址:${theater.address}．線上購票．電影時刻表:${movieNames}`;
}
