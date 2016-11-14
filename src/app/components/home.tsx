import * as React from 'react';
import MovieDetail from './movieDetail';
import AutoComplete from 'material-ui/AutoComplete';
import YahooMovie from '../../models/YahooMovie';

class Home extends React.Component<any, any> {
  allMoviesName: Array<Object> = [];
  resultMovie: any = {};
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      dataSource: [],
      resultMovie: { chineseTitle: '' }
    };
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

  handleUpdateInput(text) { this.setState({ searchText: text }) }

  clearSearchText() { this.setState({ searchText: '' }) }

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
            yahooId
            posterUrl
            chineseTitle
            englishTitle
            releaseDate
            type
            runTime
            director
            actor
            launchCompany
            companyUrl
            sourceUrl                       
            yahooRating
            imdbRating            
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
      <div className="container">
        <div style={{ position: 'relative' }}>
          <AutoComplete
            hintText="電影名稱(中英皆可)"
            dataSource={this.state.dataSource}
            floatingLabelText="找電影"
            fullWidth={true}
            filter={AutoComplete.fuzzyFilter}
            maxSearchResults={6}
            onNewRequest={this.search.bind(this)}
            searchText={this.state.searchText}
            onUpdateInput={this.handleUpdateInput.bind(this)}
            />
          <button className="clearButton" onClick={this.clearSearchText.bind(this)}>X</button>
        </div>        
        <MovieDetail movie={this.state.resultMovie}></MovieDetail>
      </div>
    );
  }
}
export default Home;