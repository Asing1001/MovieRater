import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import { gql, graphql } from 'react-apollo';

const allMoviesNamesQuery = gql`
   query {
     allMoviesNames{
      value
      text
     }
   }
 `;
console.log(allMoviesNamesQuery)
@graphql(allMoviesNamesQuery,{options:{}})
class Home extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    };
  }

  componentDidMount() {
    console.log(this.props)
    document.querySelector('input').focus();
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
        yahooIds = this.props.data.allMoviesNames.filter(({ value, text }) => text.toLowerCase().indexOf(searchText) !== -1).map(({ value }) => parseInt(value)).slice(0, 6);
      } else {
        yahooIds = filteredList.map(({ value }) => parseInt(value.key)).slice(0, 6);
      }
    } else {
      yahooIds.push(parseInt(selectItem.value));
    }

    if (yahooIds.length === 1) {
      browserHistory.push(`/movie/${yahooIds}`)
    } else {
      browserHistory.push(`/movielist/${yahooIds}`)
    }
  }


  render() {
    return (
      <div className="container" >
        <div className="autoCompleteWrapper">
          <AutoComplete
            hintText="電影名稱(中英皆可)"
            dataSource={this.props.data.allMoviesNames||[]}
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
          this.props.children
        }
      </div>
    );
  }
}
export default Home;