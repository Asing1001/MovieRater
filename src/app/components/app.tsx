import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/graphql',
    // opts: {
    //   method:'GET'      
    // }
  })
});

injectTapEventPlugin();

class App extends React.Component<{}, {}> {
  muiTheme = getMuiTheme({
    userAgent: navigator.userAgent,
    // spacing: darkBaseTheme.spacing,
    // fontFamily: darkBaseTheme.fontFamily,
    // palette: darkBaseTheme.palette,
  })

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider muiTheme={this.muiTheme}>
          {this.props.children}
        </MuiThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;