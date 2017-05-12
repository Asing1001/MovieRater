import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import SVGActionSearch from 'material-ui/svg-icons/action/search';
import SVGContentClear from 'material-ui/svg-icons/content/clear';
import SVGBackSpace from 'material-ui/svg-icons/hardware/keyboard-backspace';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

class AppBarSearching extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      dataSource: []
    };
  }

  private clearSearchText() {
    this.setState({ searchText: '' });
    setTimeout(() => document.querySelector('input').focus(), 100);
  }

  private handleUpdateInput(text) { this.setState({ searchText: text }) }

  componentDidMount() {
    this.getDataSource();
  }

  private getDataSource() {
    fetch('/graphql?query={allMoviesNames{value,text}}')
      .then(res => res.json())
      .then((json: any) => {
        this.setState({ dataSource: json.data.allMoviesNames })
      });
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

    if (yahooIds.length === 1) {
      browserHistory.push(`/movie/${yahooIds}`)
    } else {
      browserHistory.push(`/movielist/${yahooIds}`)
    }
  }

  render() {
    return (
      <Paper zDepth={2} className={`appBar searching ${this.props.className}`}>
        <IconButton className="leftBtn" onTouchTap={this.props.onBackSpaceIconClick}><SVGBackSpace /></IconButton>
        <span className="hidden-xs barTitle">上一步</span>
        <span className="searchArea">
          <SVGActionSearch className="hidden-xs searchIcon" />
          <AutoComplete
            hintText={<span>搜尋電影名稱(中英皆可)</span>}
            dataSource={this.state.dataSource}
            filter={AutoComplete.caseInsensitiveFilter}
            maxSearchResults={8}
            onNewRequest={this.onNewRequest.bind(this)}
            searchText={this.state.searchText}
            onUpdateInput={this.handleUpdateInput.bind(this)}
            menuStyle={{ minWidth: "500px" }}
            fullWidth={true}
          />
        </span>
        <IconButton onTouchTap={this.clearSearchText.bind(this)} className="visible-xs rightBtn"><SVGContentClear /></IconButton>
      </Paper>
    );
  }
}
export default AppBarSearching;