import React from 'react';
import './user.css';
import { Icon, Label, Menu, Table, Header, Image, Checkbox, Button, Dropdown, Input } from 'semantic-ui-react';
import axios from 'axios';
import UserIntegrations from "./integrations/integrations";
const config = require('../../config/app-config');


class UserComponent extends React.Component {
    state = {users:[],
        usersColumns:['Name', 'Email', 'Tags', 'company', 'position',
            'instrument Name', 'instrument Model', 'Research', 'status' , ''], pages:0, currentPage: 0, filterStr : '', showIntegrations: false};
    componentDidMount() { this.getUsers() }

    // ------------ fetch users api data -----------
    getUsers = (pageNumber = 1) => {
        if( pageNumber !== this.state.currentPage && pageNumber >= 1){
            this.setState({ loading: true});
            axios.get(config.API.url + 'users', { params: {pageNo: pageNumber}}).then(response => {
                this.setState({ users: response.data.users,  pages: response.data.pages, currentPage : pageNumber, loading: false});
            }).catch(error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }

    // ------------ Verify User-----------
    verifyUser = (selectedUser, index) => {
        if( selectedUser ){
            this.setState({ loading: true});
            selectedUser.status = 'verified';
            axios.put(config.API.url + 'users', {user: selectedUser}).then((data) => {
                this.state.users[index] = selectedUser;
                this.setState({ users: this.state.users, loading: false});
            }).catch(error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }

    openIntegrations = (user, index) => this.setState({showIntegrations: true, userID: user._id});
    closeIntegrations = (user, index) => this.setState({showIntegrations: false, userID: null});

    // ------------ delete user -----------
    deleteUser = (selectedUser, index) => {
        if( selectedUser ){
            this.setState({ loading: true});
            axios.put(config.API.url + 'users/delete', {user: selectedUser}).then((data) => {
                this.state.users.splice(index, 1);
                this.setState({ users: this.state.users, loading: false});
            }).catch( error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }


    // ------------ earch users api data -----------
    searchUsers = () => {
        if( this.state.filterStr){
            this.setState({ loading: true});
            axios.get(config.API.url + 'users/search', { params: {search: this.state.filterStr}}).then(response => {
                this.setState({ users: response.data.users,  pages: 1, currentPage : 1, loading: false});
            }).catch(error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }

    render() {
        const { filterStr } = this.state;
        const userTags = (tagsString) => {
            let resultTags = null;
            if( tagsString && tagsString.split(',').length > 0 ){
                resultTags = tagsString.split(',').map(tage => {return (<Label as='a'> {tage} </Label>)})
            }else {
                if( tagsString ){
                    resultTags =  <Label as='a'> {resultTags} </Label>
                }else{}
            }
        }
        const usersRows  = this.state.users.map((user, index)=> {
            let resultTags = null;
            if( user.work.topics && user.work.topics.split(',').length > 0 ){
                resultTags = user.work.topics.split(',').map(tage => {return (<Label as='a'> {tage} </Label>)})
            }else {
                if( user.work.topics ){ resultTags =  <Label as='a'> {user.work.topics} </Label> }else{}
            }
            return (
                <Table.Row  key={'row' + index}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{resultTags}</Table.Cell>
                    <Table.Cell>{user.work.company}</Table.Cell>
                    <Table.Cell>{user.work.position}</Table.Cell>
                    <Table.Cell>{user.measurement.instrumentName}</Table.Cell>
                    <Table.Cell>{user.measurement.instrumentModel}</Table.Cell>
                    <Table.Cell>{user.type}</Table.Cell>
                    <Table.Cell>{user.status}</Table.Cell>
                    <Table.Cell>
                        <Dropdown item text=''>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => this.deleteUser(user, index)}>Delete</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.verifyUser(user, index)}>Verify</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.openIntegrations(user, index)}>Integrations</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Table.Cell>
                </Table.Row>
            );
        });

        // construct pages
        const pages = [];
        for(let i=1; i<= this.state.pages; i++){ pages.push(i); }
        const usersPages  = pages.map((page, index)=> <Menu.Item as='a' key={'page' + index} className={page === this.state.currentPage ? 'active': null} onClick={() => this.getUsers(page)}>{page}</Menu.Item> );

        // construct columns headers
        const usersColumns = this.state.usersColumns.map((userCol, index)=> <Table.HeaderCell key={'col' + index}>{userCol}</Table.HeaderCell>);
        const loader = this.state.loading ? <div className="loader loaderContainer"></div> : null;
        return (
            this.state.showIntegrations ? <div>
                    <Button animated onClick={() => this.closeIntegrations()}>
                        <Button.Content visible>Back</Button.Content>
                        <Button.Content hidden><Icon name='arrow left' /></Button.Content>
                    </Button>
                    <UserIntegrations userID={this.state.userID}></UserIntegrations>
                </div>
                :
            <div className='userContainer'>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='users' circular style={{color: '#2980b9'}}/> <Header.Content>Manage Users</Header.Content>
                </Header>
                {loader}
                <Table celled>
                    <Table.Header><Table.Row>{usersColumns}</Table.Row></Table.Header>
                    <Table.Body>{usersRows}</Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                 <Input action={{ type: 'submit', content: 'Go', onClick: () => this.searchUsers() }} placeholder='Enter a User Name...'
                                        value={ filterStr } onChange={ e => this.setState({ filterStr: e.target.value }) }/>
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='6'>
                                <Menu floated='right' pagination>
                                    <Menu.Item as='a' icon onClick={() => this.getUsers(this.state.currentPage - 1 )}><Icon name='chevron left'/></Menu.Item>
                                    {usersPages}
                                    <Menu.Item as='a' icon  onClick={() => this.getUsers(this.state.currentPage + 1)}><Icon name='chevron right'/></Menu.Item>
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}
export default UserComponent;