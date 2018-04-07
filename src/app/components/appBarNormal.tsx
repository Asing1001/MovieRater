import * as React from 'react';
import AppDrawer from './appDrawer';
import SVGActionSearch from 'material-ui/svg-icons/action/search';
import SVGContentSort from 'material-ui/svg-icons/content/sort';
import SVGActionSettings from 'material-ui/svg-icons/action/settings';
import SVGNavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { cyan500, cyan300 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { SortType } from '../sorting';

const normalStyles = {
    backgroundColor: cyan500,
    color: 'white'
}

class AppBarNormal extends React.PureComponent<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            barTitle: '現正上映'
        }
    }

    drawerToggle = null;

    render() {
        return (
            <Paper zDepth={2} className={`appBar normal ${this.props.className}`} style={normalStyles}>
                <IconButton className="leftBtn" onTouchTap={e => { e.preventDefault(); this.drawerToggle() }}><SVGNavigationMenu color={normalStyles.color} /></IconButton>
                <span className="barTitle">{this.state.barTitle}</span>
                <span onClick={this.props.onSearchIconClick} className="hidden-xs searchArea" style={{ backgroundColor: cyan300 }}>
                    <SVGActionSearch className="searchIcon" color={normalStyles.color} />
                    <span>搜尋電影名稱(中英皆可)</span>
                </span>
                <IconButton onTouchTap={e => { e.preventDefault(); this.props.onSearchIconClick() }} className="visible-xs rightBtn"><SVGActionSearch color={normalStyles.color} /></IconButton>
                <IconMenu
                    className="sortingBtn"
                    iconButtonElement={
                        <IconButton><SVGContentSort color={normalStyles.color} /></IconButton>
                    }
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                    <MenuItem primaryText="依IMDB排序" onTouchTap={e => { e.preventDefault(); this.props.switchSorting(SortType.imdb) }} />
                    <MenuItem primaryText="依Yahoo排序" onTouchTap={e => { e.preventDefault(); this.props.switchSorting(SortType.yahoo) }} />
                    <MenuItem primaryText="依Ptt排序" onTouchTap={e => { e.preventDefault(); this.props.switchSorting(SortType.ptt) }} />
                    <MenuItem primaryText="依上映日期排序" onTouchTap={e => { e.preventDefault(); this.props.switchSorting(SortType.releaseDate) }} />
                </IconMenu>
                <AppDrawer changeTitle={barTitle => this.setState({ barTitle })} ref={instance => this.drawerToggle = instance && instance.toggle} />
            </Paper>
        );
    }
}
export default AppBarNormal;