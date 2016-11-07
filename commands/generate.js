
var fs = require('fs');
var api = require('../include/api.js');
var disk = require('../include/disk.js');
var config = require('../include/config.js');

function generate(params, next) {
    getUser(next);
}

function getUser(next) {
   api.fetchUser(function(err, user) {
       if (err) return next(err);
       return createToken(user, next);
   });
}

function createToken(user, next) {
    var description = 'cli ' + (new Date()).toString();
    api.createApiToken(description, function (err, result) {
        if (err) return next(err);
        var data = { username: user.email, token: result.token };
        return checkPath(data, next);
    });
}

function checkPath(data, next) {
    disk.checkPath(function(err) {
        if (err) return next(err);
        return writeFile(data, next);
    });
}

function writeFile(data, next) {
    fs.writeFile(config.apiTokenFile, JSON.stringify(data), { mode: 0o600 }, function (err) {
        if (err) return next(err);
        console.log('API token saved to ' + config.apiTokenFile);
        return next(null);
    });
}

module.exports = generate;