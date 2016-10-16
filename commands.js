
var fs = require('fs');
var inquirer = require('inquirer');
var api = require('./api.js');

var __path = '~/.ahst/robotKey';

function askCredentials(next) {
    var questions = [
        { type: 'input', name: 'username', message: 'Username' },
        { type: 'password', name: 'password', message: 'Password' }
    ];

    inquirer.prompt(questions)
        .then(function (answers) {
            var credentials = { username: answers.username, password: answers.password };
            api.setCredentials(credentials);
            next(null, credentials);
        })
        .catch(function (err) {
            next(err);
        });
}

function getCredentials(next) {
    fs.readFile(__path, {}, (err, content) => {
        if (err && err.code === "ENOENT") {
            console.error("No automation key file " + __path);
            return askCredentials(next);
        }

        if (err) {
            console.log("Failed to read " + __path);
            return askCredentials(next);
        }

        var data = JSON.parse(content);
        api.setCredentials(data);

        next(null, data);
    });
}

function run(params, next) {
    getCredentials(function (err) {
        if (err) return next(err);

        fs.readFile(params.filename, function (err, code) {
            if (err) return next(err);

            api.createJob(params.filename, code, function (err, job) {
                if (err) return next(err);

                console.log('[' + job.id + ']');
                next(null);
            });
        });
    });
}

function generate(params, next) {
    getCredentials(function (err, creds) {
        if (err) return next(err);

        api.createKey(function (err, key) {
            if (err) return next(err);

            var data = { username: creds.username, key: key };
            fs.writeFile(__path, JSON.stringify(data), { mode: 0o600 }, function (err) {
                if (err) return next(err);

                console.log('Automation key saved to ' + __path);
                next(null);
            });
        });
    });
}

module.exports = {
    'run': run,
    'generate': generate
};