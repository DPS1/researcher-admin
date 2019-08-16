import React from 'react';
import './integrations.css';
import {Label, Menu, Tab, Header, Icon, Card, Comment} from 'semantic-ui-react'
import axios from 'axios';
import {Table} from "semantic-ui-react/dist/commonjs/collections/Table/Table";
import {Dropdown} from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
const API = require('../../../config/api-config');


class UserIntegrations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: false, userID: this.props.userID, dropbox: {}, google_drive: {}, conversations: []};
    }
    componentDidMount() {
        this.getUserDropbox();
        this.getUserConversation();
        // this.getUserGoogleDrive();
    }

    // ------------ fetch users api data -----------
    getUserConversation = () => {
        if( this.state.userID ){
            this.setState({ loading: true});
            axios.get(API.intercome.conversations, { params: {userID: this.state.userID}}).then(response => {
                this.setState({ conversations: response.data.conversations, loading: false});
                console.log(this.state.conversations)
            }).catch(error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }

    // ------------ fetch users api data -----------
    getUserGoogleDrive = () => {
        if( this.state.userID ){
            this.setState({ loading: true});
            axios.get(API.google_drive.files, { params: {userID: this.state.userID}}).then(response => {
                this.setState({ google_drive: response.data.google_drive, loading: false});
            }).catch(error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }



    // ------------ fetch users api data -----------
    getUserDropbox = () => {
        if( this.state.userID ){
            this.setState({ loading: true});
            axios.get(API.dropbox.files, { params: {userID: this.state.userID}}).then(response => {
                this.setState({ dropbox: response.data.dropbox, loading: false});
            }).catch(error => {
                this.setState({ loading: false});
                console.log(error);
            })
        }
    }

    // ------------ get file icon -----------
    getFileIcon = (file) => {
        let fileIcon = null;
        switch (true) {
            case file.name.indexOf('.pdf') !== -1: fileIcon = <Icon name='file pdf' style={{color: 'red'}}/>; break;
            default: fileIcon = <Icon name='file'/>
        }
        return <div className='fileContent'>{fileIcon}</div>;
    }

    // ------------  download file -----------
    downloadFile = (file) => {
        this.setState({ loading: true});
        axios.post(API.dropbox.filesDownload, { dropbox: this.state.dropbox.config, filePath: file.path_display}).then(response => {
            const url = window.URL.createObjectURL(new Blob(response.data.fileBinary.data));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sample.${response.data.name}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            this.setState({ loading: false});
        }).catch(error => {
            this.setState({ loading: false});
            console.log(error);
        })
    }

    render() {
        const loader = this.state.loading ? <div className="loader loaderContainer"></div> : null;

        // ------------------- dropbox ----------------
        const dropboxFiles = [];
        if( this.state.dropbox && this.state.dropbox.files){
            this.state.dropbox.files.forEach((file, index)=> {
                const fileActions =   <Icon name='download'  onClick={() => this.downloadFile(file)}/>
                dropboxFiles.push({header: file.name, meta: 'Size: ' + file.size, description: this.getFileIcon(file), extra: fileActions})
            });
        }

        // ------------------ intercome ----------------------
        const conversations = this.state.conversations.map((message, index)=> {
            const creationDate = new Date(message.created_at).toDateString();
            return ( <Comment key={'message' + index}>
                    <Comment.Avatar as='a' src='/assets/img/user.png' />
                    <Comment.Content>
                        <Comment.Author>{message.conversation_message.author.name}</Comment.Author>
                        <Comment.Metadata><div>{creationDate}</div></Comment.Metadata>
                        <Comment.Text dangerouslySetInnerHTML={{__html: message.conversation_message.body}}>
                        </Comment.Text>
                    </Comment.Content>
                </Comment>
            )});





        const panes = [
            { menuItem: { key: 'dropbox', icon: 'dropbox', content: 'dropbox' }, render: () => <Tab.Pane><Card.Group items={dropboxFiles} /></Tab.Pane> },
            { menuItem: { key: 'googledrive', icon: 'google drive', content: 'google drive' }, render: () => <Tab.Pane></Tab.Pane> },
            { menuItem: { key: 'intercom', icon: 'user', content: 'intercom' }, render: () => <Tab.Pane> <div className='messagesContainer'> <Comment.Group>{conversations}</Comment.Group></div></Tab.Pane> },
        ]




        return (
            <div>
                <br/>
                <Header as='h5' dividing> <Icon name='user' style={{color: '#2980b9'}}/> mohamed qorany</Header>
                {loader}
                <br/>
                <Tab panes={panes} />
            </div>
        );
    }
}
export default UserIntegrations;