var os = require('os');

var config = {};

config.env = 'prod';
config.baseUrl = 'https://api.ahst.fr',
config.dataDir = os.homedir() + '/.ahst',
config.tokenFile = config.dataDir + '/token';
config.apiTokenFile = config.dataDir + '/apiToken';

if (process.env.NODE_ENV == 'dev') {
    config.env = 'dev';
    config.baseUrl = 'http://localhost:3000';
}

module.exports = config;