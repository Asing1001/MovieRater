import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'isomorphic-fetch';
import SVGActionSearch from 'material-ui/svg-icons/action/search';
import SVGContentClear from 'material-ui/svg-icons/content/clear';
import SVGBackSpace from 'material-ui/svg-icons/hardware/keyboard-backspace';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { gql, graphql } from 'react-apollo';

const allMoviesNamesQuery = gql`
  query AllMoviesNames {
    allMoviesNames
    {
      value
      text
    }
  }
`;

@graphql(allMoviesNamesQuery, {
  options: { ssr: false }
})
class AppBarSearching extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: ''
    };
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  private clearSearchText() {
    this.setState({ searchText: '' });
    requestAnimationFrame(() => document.querySelector('input').focus());
  }

  private handleUpdateInput(text) { this.setState({ searchText: text }) }

  private onNewRequest(selectItem, index, filteredList) {
    let yahooIds = [];
    let searchText = '';
    if (index === -1) {
      searchText = selectItem.toLowerCase();
      if (!filteredList) {
        yahooIds = this.props.data.allMoviesNames.filter(({ value, text }) => text.toLowerCase().indexOf(searchText) !== -1).map(({ value }) => parseInt(value)).slice(0, 6);
      } else {
        yahooIds = filteredList.map(({ value }) => parseInt(value.key)).slice(0, 6);
      }
    } else {
      yahooIds.push(parseInt(selectItem.value));
    }

    if (yahooIds.length === 0) {
      this.context.router.history.push(`/movienotfound/${searchText}`)
    }
    else if (yahooIds.length === 1) {
      this.context.router.history.push(`/movie/${yahooIds}`)
    } else {
      this.context.router.history.push(`/movies/${yahooIds}`)
    }
  }

  render() {
    if (this.props.data.loading) {
      return null
    }
    return (
      <Paper zDepth={2} className={`appBar searching ${this.props.className}`}>
        <IconButton className="leftBtn" onTouchTap={e => { e.preventDefault(); this.props.onBackSpaceIconClick() }}><SVGBackSpace /></IconButton>
        <span className="hidden-xs barTitle">上一步</span>
        <span className="searchArea">
          <SVGActionSearch className="hidden-xs searchIcon" />
          <AutoComplete
            hintText={<span>搜尋電影名稱(中英皆可)</span>}
            dataSource={this.props.data.allMoviesNames}
            filter={AutoComplete.caseInsensitiveFilter}
            maxSearchResults={8}
            onNewRequest={this.onNewRequest.bind(this)}
            searchText={this.state.searchText}
            onUpdateInput={this.handleUpdateInput.bind(this)}
            menuStyle={{ minWidth: "500px" }}
            fullWidth={true}
          />
        </span>
        <IconButton onTouchTap={e => { e.preventDefault(); this.clearSearchText() }} className="visible-xs rightBtn"><SVGContentClear /></IconButton>
      </Paper>
    );
  }
}
export default AppBarSearching;