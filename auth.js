
var fs = require('fs');
var inquirer = require('inquirer');

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
    api.fetchToken(tokenData, function(err, data) {
        if (err) return next(err);
        if (data.valid) return next(null, tokenData);
        if (data.refreshable) return refreshToken(tokenData, next);
        return getKey(next);
    });
}

function refreshToken(tokenData, next) {
    api.refreshToken(tokenData, function(err, data) {
        if (err) return getKey(next);
        return next(null, data);
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
        return next(null);
    });
}

module.exports = authenticate;