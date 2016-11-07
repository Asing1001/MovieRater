import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import { YahooMovie } from '../../crawler/yahooCrawler';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

class Home extends React.Component<any, any> {
  allMoviesName: Array<Object> = [];
  resultMovie: any = {};
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      resultMovie: { chineseTitle: '' }
    };
    /*
    var json = {
      "data": {
        "allMovies": [
          {
            "chineseTitle": "零日網路戰",
            "englishTitle": "Zero Days",
            "yahooId": 6403
          }
        ]
      }
    }
    json.data.allMovies.forEach(({chineseTitle, englishTitle, yahooId}: YahooMovie) => {
      this.allMoviesName.push({ value: yahooId, text: chineseTitle }, { value: yahooId, text: englishTitle })
    });
    this.state.dataSource = this.allMoviesName;
    */
    this.getDataSource();
  }

  private getDataSource() {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: "{allMovies{chineseTitle,englishTitle,yahooId}}" }),
      credentials: 'include',
    }).then(res => res.json())
      .then(json => {
        json.data.allMovies.forEach(({chineseTitle, englishTitle, yahooId}: YahooMovie) => {
          this.allMoviesName.push({ value: yahooId, text: chineseTitle }, { value: yahooId, text: englishTitle })
        });
        this.setState({ dataSource: this.allMoviesName })
      });
  }

  search(selectItem, index) {
    console.log(selectItem, index)
    fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        {
          movie(yahooId:${selectItem.value}){
            actor    
            chineseTitle
            englishTitle
            yahooId
            rating
            imdbRating
            posterUrl
            tomatoRating
            badRateCount
            goodRateCount
            normalRateCount
          }
        }
    ` }),
      credentials: 'include',
    }).then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({ resultMovie: json.data.movie });
      });
  }

  render() {
    return (
      <div>

        <AutoComplete
          hintText="電影名稱(中英皆可)"
          dataSource={this.state.dataSource}
          floatingLabelText="找電影"
          fullWidth={true}
          filter={AutoComplete.fuzzyFilter}
          maxSearchResults={6}
          onNewRequest={this.search.bind(this)}
          />
        <Card className="temp">
          <CardHeader
            title={<CardText>
              <img src="public/image/imdb.png" /> {this.state.resultMovie.imdbRating} <img src="public/image/yahoo.png" /> {this.state.resultMovie.rating} <img src="public/image/rottentomatoes.png" />{this.state.resultMovie.tomatoRating}
            </CardText>}
            >
          </CardHeader>

          <CardMedia
            overlay={<CardTitle title={this.state.resultMovie.chineseTitle} subtitle={this.state.resultMovie.englishTitle} />}
            >
            <img src={this.state.resultMovie.posterUrl} />
          </CardMedia>
          <CardActions>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default Home;