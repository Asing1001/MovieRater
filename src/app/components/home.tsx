import * as React from 'react';
import AppBarSearching from './appBarSearching';
import AppBarNormal from './appBarNormal';

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
    };
  }

  handleSearchToggle = () => {
    this.setState({ searching: !this.state.searching });
    setTimeout(() => document.querySelector('input').focus(), 100);
  };

  render() {
    return (
      <div>
        <AppBarSearching
          className={!this.state.searching && "hidden"}
          onBackSpaceIconClick={this.handleSearchToggle}>
        </AppBarSearching>
        <AppBarNormal
          className={this.state.searching && "hidden"}
          onSearchIconClick={this.handleSearchToggle}> >
        </AppBarNormal>
        <div className="container" style={{ marginTop: '.5em' }} >
          {
            this.props.children
          }
        </div>
      </div>
    );
  }
}
export default Home;