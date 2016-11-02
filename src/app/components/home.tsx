import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class Home extends React.Component<any,any> {
  constructor(props){
      super(props)
      this.state = {test:'test'};
  }

  search(){
    alert('search!');
  }

  render() {
    return (
      <div className='alert alert-info'>
        Hello from Home Component!
        <RaisedButton label="Default" />
        <div>{this.state.test}</div>
        <button onClick={this.search.bind(this)}>Search</button>
      </div>
    );
  }
}

export default Home;