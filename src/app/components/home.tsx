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
        <AppBarNormal
          className={this.state.searching && "vanish"}
          onSearchIconClick={this.handleSearchToggle}> >
        </AppBarNormal>
        <AppBarSearching
          className={!this.state.searching && "vanish"}
          onBackSpaceIconClick={this.handleSearchToggle}>
        </AppBarSearching>
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