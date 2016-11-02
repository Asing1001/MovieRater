import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

class App extends React.Component<{},{}> {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent})}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export default App;