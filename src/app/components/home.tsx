import * as React from 'react';
import MovieDetailTabs from './movieDetailTabs';
import MovieList from './movieList';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import Movie from '../../models/movie';
import 'isomorphic-fetch';
import RefreshIndicator from 'material-ui/RefreshIndicator';
const ALLDATA = `{
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
            yahooRating
            imdbID
            imdbRating
            tomatoURL            
            tomatoRating
            relatedArticles{title,push,url,date,author}
            summary
          }`;

const BRIEFDATA = `{
            yahooId
            posterUrl
            chineseTitle
            englishTitle
            releaseDate
            type
            runTime
            yahooRating
            imdbID
            imdbRating
            tomatoURL            
            tomatoRating            
            relatedArticles{title}
            briefSummary
          }`;

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      dataSource: [],
      resultMovies: [],
    };
  }

  componentWillMount() {
    if (this.props.params.id) {
      this.search([parseInt(this.props.params.id)]);
    } else {
      this.requestGraphQL(`{recentMovies${BRIEFDATA}}`).then((json: any) => {
        this.setState({ resultMovies: json.data.recentMovies.map(movie => this.classifyArticle(movie)) });
      });
    }
  }

  componentDidMount() {
    this.getDataSource();
    document.querySelector('input').focus();
  }

  private getDataSource() {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: "{allMoviesNames{value,text}}" }),
      credentials: 'include',
    }).then(res => res.json())
      .then((json: any) => {
        this.setState({ dataSource: json.data.allMoviesNames })
      });
  }

  private handleUpdateInput(text) { this.setState({ searchText: text }) }

  private clearSearchText() {
    this.setState({ searchText: '' });
    document.querySelector('input').focus();
  }

  private onNewRequest(selectItem, index, filteredList) {
    let yahooIds = [];
    if (index === -1) {
      let searchText = selectItem.toLowerCase();
      if (!filteredList) {
        yahooIds = this.state.dataSource.filter(({ value, text }) => text.toLowerCase().indexOf(searchText) !== -1).map(({ value }) => parseInt(value)).slice(0, 6);
      } else {
        yahooIds = filteredList.map(({ value }) => parseInt(value.key)).slice(0, 6);
      }
    } else {
      yahooIds.push(parseInt(selectItem.value));
    }

    this.search(yahooIds);
  }

  private requestGraphQL(query: string) {
    this.setState({isLoading:true});
    return fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query
      }),
      credentials: 'include',
    }).then(res => {
      this.setState({isLoading:false});      
      return res.json()
    })
  }

  private search(yahooIds: Number[]) {
    this.requestGraphQL(`
        {
          movies(yahooIds:${JSON.stringify(yahooIds)})${yahooIds.length === 1 ? ALLDATA : BRIEFDATA}
        }
    `)
      .then((json: any) => {
        this.setState({ resultMovies: json.data.movies.map(movie => this.classifyArticle(movie)) });
      });
  }

  private classifyArticle(movie: Movie) {
    if (!movie.relatedArticles) return movie;
    var [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], []];
    movie.relatedArticles.forEach((article) => {
      let title = article.title;
      if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
        goodRateArticles.push(article);
      } else if (title.indexOf('普雷') !== -1) {
        normalRateArticles.push(article)
      } else if (title.indexOf('負雷') !== -1) {
        badRateArticles.push(article)
      } else {
        otherArticles.push(article);
      }
    });
    movie.goodRateArticles = goodRateArticles;
    movie.normalRateArticles = normalRateArticles;
    movie.badRateArticles = badRateArticles;
    movie.otherArticles = otherArticles;
    return movie;
  }

  render() {
    return (
      <div className="container" >
        <div className={`backdrop ${this.state.isLoading?'':'hide'}`}>
          <RefreshIndicator
            size={40}
            left={-20}
            top={0}
            status="loading"
            style={{ marginLeft: '50%', marginTop: '25%', zIndex: 3 }}            
          />
        </div>
        <div className="autoCompleteWrapper">
          <AutoComplete
            hintText="電影名稱(中英皆可)"
            dataSource={this.state.dataSource}
            floatingLabelText="找電影"
            fullWidth={true}
            filter={AutoComplete.caseInsensitiveFilter}
            maxSearchResults={6}
            onNewRequest={this.onNewRequest.bind(this)}
            searchText={this.state.searchText}
            onUpdateInput={this.handleUpdateInput.bind(this)}
          />
          <button className={`clearButton ${this.state.searchText ? '' : 'displayNone'}`} onClick={this.clearSearchText.bind(this)}>X</button>
        </div>
        {
          this.state.resultMovies.length === 1 ?
            <Paper zDepth={2}>
              <MovieDetailTabs movie={this.state.resultMovies[0]}></MovieDetailTabs>
            </Paper> :
            <MovieList movies={this.state.resultMovies}></MovieList>
        }
      </div>
    );
  }
}
export default Home;