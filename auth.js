
var fs = require('fs');
var inquirer = require('inquirer');
var moment = require('moment');

var config = require('./config.js');
var api = require('./api.js');

function authenticate(next) {
    getStoredToken(next);
}

function getStoredToken(next) {
    fs.readFile(config.tokenFile, 'utf8', (err, content) => {
        if (err && err.code === "ENOENT") {
            console.error("No token file " + config.tokenFile);
            return getKey(next);
        }

        if (err) {
            console.log("Failed to read " + config.tokenFile);
            return getKey(next);
        }

        var data = JSON.parse(content);
        return checkToken(data, next);
    });
}

function checkToken(tokenData, next) {
    if (!tokenData.token || !tokenData.refreshToken) {
        return getKey(next);
    }

    var expireAt = moment(tokenData.expireAt);
    var validLimit = expireAt.add(1, 'hours');
    var refreshLimit = expireAt.add(1, 'hours');
    var now = moment();

    if (now < expireAt) {
        return success(tokenData, next);
    }
    
    if (now < refreshLimit) {
        return refreshToken(tokenData, next);
    }

    return getKey(next);
}

function refreshToken(tokenData, next) {
    api.refreshToken(tokenData, function(err, data) {
        if (err) return getKey(next);
        return success(data, next);
    });
}

function getKey(next) {
    fs.readFile(config.keyFile, 'utf8', (err, content) => {
        if (err && err.code === "ENOENT") {
            console.error("No key file " + config.keyFile);
            return askCredentials(next);
        }

        if (err) {
            console.log("Failed to read " + config.keyFile);
            return askCredentials(next);
        }

        var data = JSON.parse(content);
        return login('file', data, next);
    });
}

function askCredentials(next) {
    var questions = [
        { type: 'input', name: 'username', message: 'Username' },
        { type: 'password', name: 'password', message: 'Password' }
    ];

    inquirer.prompt(questions)
        .then(function (answers) {
            var credentials = { username: answers.username, password: answers.password };
            return login('prompt', credentials, next);
        })
        .catch(function (err) {
            return next(err);
        });
}

function login(mode, creds, next) {
    api.createToken(creds, function(err, data) {
        if (err && mode == 'file') return askCredentials(next);
        if (err && mode == 'prompt') return next(err);
        return saveToken(data, next);
    });
}

function saveToken(data, next) {
    fs.writeFile(config.tokenFile, JSON.stringify(data), { mode: 0o600 }, function (err) {
        if (err) return next(err);
        return success(data, next);
    });
}

function success(tokenData, next) {
    api.setToken(tokenData.token);
    return next(null);
}

module.exports = authenticate;