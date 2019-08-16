import React from 'react';
import './side-menu.css';
import {Header, Icon, Menu} from 'semantic-ui-react'

class SideMenuComponent extends React.Component {
    state = { activeItem: 'users' }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    render() {
        const { activeItem } = this.state
        return (
            <Menu pointing secondary vertical className='sideMenu'>
                <Menu.Item name='users' active={activeItem === 'users'} onClick={this.handleItemClick}>
                    Users <Icon name='users'/>
                </Menu.Item>
            </Menu>
        )
    }
}
export default SideMenuComponent;