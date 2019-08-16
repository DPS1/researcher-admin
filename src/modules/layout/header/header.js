import React from 'react';
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react'
import './header.css';

class HeaderComponent extends React.Component {
    render() {
        return (
            <Menu inverted attached='top' className="appHeader">
                <Menu.Item>
                    <img src='/assets/img/Logo.png' alt=""/>
                </Menu.Item>
            </Menu>
        );
    }
}
export default HeaderComponent;