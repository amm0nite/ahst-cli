
var fs = require('fs');
var api = require('../api.js');
var disk = require('../disk.js');
var config = require('../config.js');

function generate(params, next) {
    getUser(next);
}

function getUser(next) {
   api.fetchUser(function(err, user) {
       if (err) return next(err);
       return createKey(user, next);
   });
}

function createKey(user, next) {
    api.createKey(function (err, result) {
        if (err) return next(err);
        var data = { username: user.username, key: result.key };
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
    fs.writeFile(config.keyFile, JSON.stringify(data), { mode: 0o600 }, function (err) {
        if (err) return next(err);
        console.log('Automation key saved to ' + config.keyFile);
        return next(null);
    });
}

module.exports = generate;