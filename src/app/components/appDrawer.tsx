import * as React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import SVGAvMovie from 'material-ui/svg-icons/av/movie';
import SVGImageMovieFilter from 'material-ui/svg-icons/image/movie-filter';
import SVGActionTheaters from 'material-ui/svg-icons/action/theaters';
import { List, ListItem } from 'material-ui/List';

const menus = [
    { url: '/', icon: <SVGImageMovieFilter />, text: '現正上映' },
    { url: '/upcoming', icon: <SVGAvMovie />, text: '即將上映' },
    { url: '/theaters', icon: <SVGActionTheaters />, text: '戲院總覽' },
]
class AppDrawer extends React.Component<{ changeTitle: Function }, { open: Boolean }> {
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
                            <ListItem onTouchTap={(e) => { e.preventDefault(); this.handleTouchTap(text) }} leftIcon={icon}>{text}</ListItem>
                        </Link>)}
                </List>
            </Drawer>
        );
    }
}
export default AppDrawer;