import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import { YahooMovie } from '../../crawler/yahooCrawler';


class Home extends React.Component<any, any> {
  allMovies: Array<YahooMovie> = [];
  allMoviesName: Array<String> = [];
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
    };
    fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: "{allMovies{chineseTitle,englishTitle}}" }),
      credentials: 'include',
    }).then(res => res.json())
      .then(json => {
        this.allMovies = json.data.allMovies;
        json.data.allMovies.forEach(({chineseTitle, englishTitle}: YahooMovie) => {
          return this.allMoviesName.push(chineseTitle, englishTitle)
        });
      });
  }

  handleUpdateInput = (value:string) => {
    let searchWord = value.toLowerCase();
    let matchMovies = [];
    this.allMoviesName.every(movieName => {
      if (movieName.toLowerCase().indexOf(searchWord) !== -1) {
        matchMovies.push(movieName)
      }

      return matchMovies.length !== 6;
    });

    this.setState({
      dataSource: matchMovies,
    });
  };


  search() {
    alert('search!');
  }

  render() {
    return (
      <div>
        <AutoComplete
          hintText="電影名稱(中英皆可)"
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleUpdateInput}
          floatingLabelText="找電影"
          fullWidth={true}
          />
      </div>
    );
  }
}

export default Home;