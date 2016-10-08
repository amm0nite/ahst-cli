
var fs = require('fs');
var inquirer = require('inquirer');
var api = require('./api.js');

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
    var path = '~/.ahst/credentials';
    
    fs.readFile(path, {}, (err, data) => {
        var ask = false;
        if (err && err.code === "ENOENT") {
            console.error("No credentials file " + path);
            return askCredentials(next);
        }

        if (err) {
            console.log("Failed to read " + path);
            return askCredentials(next);
        }
        
        var credentials = { type:'file', key:data };
        next(null, credentials);
    });
}

function run(params, next) {
    getCredentials(function(err, creds) {
        if (err) return next(err);

        api.setCredentials(creds);
        api.createJob('print("Hello world");', function(err, id) {
            if (err) return next(err);

            console.log(id);
        });
    });
}

module.exports = {
    'run': run
};