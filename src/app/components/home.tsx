import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import Drawer from 'material-ui/Drawer';
import ActionSearch from 'material-ui/svg-icons/action/search';
import AvMovie from 'material-ui/svg-icons/av/movie';
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from 'material-ui/List';


class Home extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      dataSource: [],
    };
  }

  componentDidMount() {
    this.getDataSource();
    document.querySelector('input').focus();
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

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleToggle}
          iconStyleLeft={{ marginTop: "0px" }}
          className="appBar"
          style={{ height: "48px" }}
          children={
            <AutoComplete
              hintText={<span>搜尋電影名稱(中英皆可)</span>}
              dataSource={this.state.dataSource}
              fullWidth={true}
              filter={AutoComplete.caseInsensitiveFilter}
              maxSearchResults={6}
              onNewRequest={this.onNewRequest.bind(this)}
              searchText={this.state.searchText}
              onUpdateInput={this.handleUpdateInput.bind(this)}
              menuStyle={{ minWidth: '500px' }}
            />}
        >
        </AppBar>

        <div className="container" style={{marginTop:'.5em'}} >
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