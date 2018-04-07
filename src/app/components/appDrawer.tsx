import * as React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import SVGAvMovie from 'material-ui/svg-icons/av/movie';
import SVGImageMovieFilter from 'material-ui/svg-icons/image/movie-filter';
import SVGActionTheaters from 'material-ui/svg-icons/action/theaters';
import SVGEmail from 'material-ui/svg-icons/communication/email';
import { List, ListItem } from 'material-ui/List';

const menus = [
    { url: '/', icon: <SVGImageMovieFilter />, text: '現正上映' },
    { url: '/upcoming', icon: <SVGAvMovie />, text: '即將上映' },
    { url: '/theaters', icon: <SVGActionTheaters />, text: '電影時刻' },
]
class AppDrawer extends React.PureComponent<{ changeTitle: Function }, { open: Boolean }> {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        };
    }

    handleTouchTap = (text) => {
        this.props.changeTitle(text);
        this.setState({ open: false });
    };

    toggle = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        return (
            <Drawer
                docked={false}
                width={300}
                containerStyle={{ maxWidth: '75%' }}
                open={this.state.open}
                onRequestChange={(open) => this.setState({ open })}
            >
                <List>
                    {menus.map(({ url, icon, text }, index) =>
                        <Link to={url} key={index}>
                            <ListItem onTouchTap={e => { this.handleTouchTap(text) }} leftIcon={icon}>{text}</ListItem>
                        </Link>)}
                        <a href="mailto:mvrater@paddingleft.com">
                            <ListItem leftIcon={<SVGEmail/>}>聯絡作者</ListItem>
                        </a>
                </List>
            </Drawer>
        );
    }
}
export default AppDrawer;