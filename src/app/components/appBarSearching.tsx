import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import AppAutoComplete from './appAutoComplete';
import SVGActionSearch from 'material-ui/svg-icons/action/search';
import SVGContentClear from 'material-ui/svg-icons/content/clear';
import SVGBackSpace from 'material-ui/svg-icons/hardware/keyboard-backspace';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { grey100 } from 'material-ui/styles/colors';

class AppBarSearching extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      dataSource: [],
    };
  }

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
            <AppBar
              title={<span>上一步</span>}
              titleStyle={{ fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px", color: 'black' }}
              iconElementLeft={<IconButton><SVGBackSpace color="black" /></IconButton>}
              onLeftIconButtonTouchTap={this.props.onBackSpaceIconClick}
              iconStyleLeft={{ marginTop: "4px" }}
              className={`appBar searching ${this.props.className}`}
              style={{ height: "56px", backgroundColor: grey100 }}
              zDepth={2}
              children={
                <div className="searchArea">
                  <span className="hidden-xs" style={{ paddingRight: "1em", }}><SVGActionSearch style={{ height: "36px", color: 'inherit' }} /></span>
                  <AppAutoComplete
                    dataSource={this.state.dataSource}
                    onNewRequest={this.onNewRequest.bind(this)}
                  />
                </div>
              }
            >
            </AppBar> 
    );
  }
}
export default AppBarSearching;