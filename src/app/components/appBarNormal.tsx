import * as React from 'react';
import AppDrawer from './appDrawer';
import SVGActionSearch from 'material-ui/svg-icons/action/search';
import SVGNavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { cyan500, cyan300 } from 'material-ui/styles/colors';

const normalStyles = {
    backgroundColor: cyan500,
    color: 'white'
}

class AppBarNormal extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    drawerToggle = null;

    render() {
        return (
            <Paper zDepth={2} className={`appBar normal ${this.props.className}`} style={{ ...normalStyles }}>
                <IconButton className="leftBtn" onTouchTap={() => this.drawerToggle()}><SVGNavigationMenu color={normalStyles.color} /></IconButton>
                <span className="barTitle">現正上映</span>
                <span onClick={this.props.onSearchIconClick} className="hidden-xs searchArea" style={{ backgroundColor: cyan300 }}>
                    <SVGActionSearch className="searchIcon" color={normalStyles.color} />
                    <span>搜尋電影名稱(中英皆可)</span>
                </span>
                <IconButton onTouchTap={this.props.onSearchIconClick} className="visible-xs rightBtn"><SVGActionSearch color={normalStyles.color} /></IconButton>
                <AppDrawer ref={instance => this.drawerToggle = instance && instance.toggle} />
            </Paper>
        );
    }
}
export default AppBarNormal;