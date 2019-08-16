import React from 'react';
import './dashboard.css';
import HeaderComponent from "../layout/header/header";
import SideMenuComponent from "../layout/side-menu/side-menu";
import UserComponent from "../user/user";
import UserIntegrations from "../user/integrations/integrations";

class DashboardComponent extends React.Component {
    render() {
        return (
           <div>
               <HeaderComponent></HeaderComponent>
               <div className='dashBoard'>
                   <SideMenuComponent></SideMenuComponent>
                   <div><UserComponent></UserComponent></div>
                   {/*<div><UserIntegrations></UserIntegrations></div>*/}
               </div>
           </div>
        )
    }
}
export default DashboardComponent;