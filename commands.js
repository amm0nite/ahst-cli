
var fs = require('fs');
var inquirer = require('inquirer');
var api = require('./api.js');

var __path = '~/.ahst/credentials';

function askCredentials(next) {
    var questions = [
        { type: 'input', name: 'username', message: 'Username' },
        { type: 'password', name: 'password', message: 'Password' }
    ];

    inquirer.prompt(questions)
        .then(function(answers) {
            var credentials = { type:'prompt', username:answers.username, password:answers.password };
            next(null, credentials);
        })
        .catch(function(err) { 
            next(err);
        });
}

function getCredentials(next) {
    fs.readFile(__path, {}, (err, data) => {
        var ask = false;
        if (err && err.code === "ENOENT") {
            console.error("No credentials file " + __path);
            return askCredentials(next);
        }

        if (err) {
            console.log("Failed to read " + __path);
            return askCredentials(next);
        }
        
        var credentials = { type: 'file', key: JSON.parse(data) };
        api.setCredentials(creds);
        
        next(null);
    });
}

function run(params, next) {
    getCredentials(function(err) {
        if (err) return next(err);

        fs.readFile(params.filename, function(err, code) {
            if (err) return next(err);

            api.createJob(params.filename, code, function(err, job) {
                if (err) return next(err);
                
                console.log('[' + job.id + ']');
                next(null);
            });
        });
    });
}

function generate(params, next) {
    getCredentials(function(err, creds) {
        if (err) return next(err);

        api.createKey(function(err, key) {
            if (err) return next(err);

            fs.writeFile(__path, JSON.stringify(key), { mode:0o600 }, function(err) {
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