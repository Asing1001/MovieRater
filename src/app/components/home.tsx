import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import Drawer from 'material-ui/Drawer';
import ActionSearch from 'material-ui/svg-icons/action/search';
import SVGContentClear from 'material-ui/svg-icons/content/clear';
import SVGBackSpace from 'material-ui/svg-icons/hardware/keyboard-backspace';
import AvMovie from 'material-ui/svg-icons/av/movie';
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import { grey100 } from 'material-ui/styles/colors';

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      dataSource: [],
      showSearchingAppBar: false,
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

    if (yahooIds.length === 1) {
      browserHistory.push(`/movie/${yahooIds}`)
    } else {
      browserHistory.push(`/movielist/${yahooIds}`)
    }
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => { this.setState({ open: false }); browserHistory.push(`/`) };

  handleSearchToggle = () => { this.setState({ showSearchingAppBar: !this.state.showSearchingAppBar }); };

  render() {
    return (
      <div>
        {
          this.state.showSearchingAppBar ?
            <AppBar
              title={<span>上一步</span>}
              titleStyle={{ fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px", color: 'black' }}
              iconElementLeft={<IconButton><SVGBackSpace color="black" /></IconButton>}
              onLeftIconButtonTouchTap={this.handleSearchToggle}
              iconStyleLeft={{ marginTop: "4px" }}
              className="appBar searching"
              style={{ height: "56px", backgroundColor: grey100 }}
              zDepth={2}
              children={
                <div className="searchArea">
                  <span className="hidden-xs" style={{ paddingRight: "1em", }}><ActionSearch style={{ height: "36px", color: 'inherit' }} /></span>
                  <AutoComplete
                    className="autoComplete"
                    hintText={<span>搜尋電影名稱(中英皆可)</span>}
                    dataSource={this.state.dataSource}
                    filter={AutoComplete.caseInsensitiveFilter}
                    maxSearchResults={6}
                    onNewRequest={this.onNewRequest.bind(this)}
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput.bind(this)}
                    menuStyle={{ minWidth: '500px' }}
                    style={{ height: '36px', width: "auto" }}
                    textFieldStyle={{ position: 'absolute', height: "36px" }}
                    textareaStyle={{ top: "7px" }}
                  />
                </div>
              }
            >
            </AppBar> :
            <AppBar
              title={<span>現正上映</span>}
              titleStyle={{ fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px" }}
              onLeftIconButtonTouchTap={this.handleToggle}
              iconStyleLeft={{ marginTop: "4px" }}
              iconElementRight={<IconButton className="visible-xs" ><ActionSearch /></IconButton>}
              iconStyleRight={{ marginTop: "4px", marginRight: '0' }}
              onRightIconButtonTouchTap={this.handleSearchToggle}
              className={`appBar`}
              style={{ height: "56px" }}
              zDepth={2}
              children={
                <div onClick={this.handleSearchToggle} className="hidden-xs searchArea" style={{ color: 'white', backgroundColor: '#4DD0E1' }}>
                  <span className="hidden-xs" style={{ paddingRight: "1em", }}><ActionSearch style={{ height: "36px", color: 'inherit' }} /></span>
                  <AutoComplete
                    className="autoComplete"
                    hintText={<span>搜尋電影名稱(中英皆可)</span>}
                    hintStyle={{ color: 'inherit' }}
                    dataSource={this.state.dataSource}
                    filter={AutoComplete.caseInsensitiveFilter}
                    maxSearchResults={6}
                    onNewRequest={this.onNewRequest.bind(this)}
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput.bind(this)}
                    menuStyle={{ minWidth: '500px' }}
                    style={{ height: '36px', width: "auto" }}
                    textFieldStyle={{ position: 'absolute', height: "36px" }}
                    textareaStyle={{ top: "7px" }}
                  />
                </div>
              }
            >
            </AppBar>
        }

        <div className="container" style={{ marginTop: '.5em' }} >
          {
            this.props.children
          }
          <Drawer
            docked={false}
            width={300}
            containerStyle={{ maxWidth: '75%' }}
            open={this.state.open}
            onRequestChange={(open) => this.setState({ open })}
          >
            <List>
              <ListItem onTouchTap={this.handleClose} leftIcon={<AvMovie />}>現正上映</ListItem>
            </List>
          </Drawer>
        </div>
      </div>
    );
  }
}
export default Home;