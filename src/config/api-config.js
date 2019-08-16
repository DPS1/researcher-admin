const config = require('./app-config');
module.exports = {
    user:{
        url: config.API.url + 'users',
    },
    dropbox: {
        files: config.API.url + 'dropbox/files',
        filesDownload: config.API.url + 'dropbox/files/download'
    },

    google_drive: {
        files: config.API.url + 'googleDrive/files',
        filesDownload: config.API.url + 'dropbox/files/download'
    },
    intercome: {
        conversations: config.API.url + 'intercome/user/messages',
    },
};