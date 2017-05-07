import * as React from 'react';
import AppDrawer from './appDrawer';
import SVGActionSearch from 'material-ui/svg-icons/action/search';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

class AppBarNormal extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    drawerToggle = null;

    render() {
        return (
            <div>
                <AppDrawer ref={instance => this.drawerToggle = instance && instance.toggle} />
                <AppBar
                    title={<span>現正上映</span>}
                    titleStyle={{ fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px" }}
                    onLeftIconButtonTouchTap={() => this.drawerToggle()}
                    iconStyleLeft={{ marginTop: "4px" }}
                    iconElementRight={<IconButton className="visible-xs" style={{ paddingRight: "40px" }} ><SVGActionSearch /></IconButton>}
                    iconStyleRight={{ marginTop: "4px", marginRight: '0' }}
                    onRightIconButtonTouchTap={this.props.onSearchIconClick}
                    className={`appBar ${this.props.className}`}
                    style={{ height: "56px" }}
                    zDepth={2}
                    children={
                        <div onClick={this.props.onSearchIconClick} className="hidden-xs searchArea"
                            style={{ color: 'white', backgroundColor: '#4DD0E1', display: 'flex', alignItems: "center" }}>
                            <span className="hidden-xs" style={{ paddingRight: "1em", marginTop: "4px" }}><SVGActionSearch style={{ height: "36px", color: 'inherit' }} /></span>
                            <span style={{ fontSize: "16px" }}>搜尋電影名稱(中英皆可)</span>
                        </div>
                    }
                >
                </AppBar>
            </div>
        );
    }
}
export default AppBarNormal;