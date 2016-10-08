
var fs = require('fs');
var prompt = require('prompt');

function askCredentials(next) {
    prompt.message = '';
    prompt.start();

    prompt.get(['username', 'password'], function (err, result) {
        if (err) {
            return next({ message: "Failed to prompt for credentials" });
        }

        var credentials = { type:'prompt', username:result.username, password:result.password };
        next(null, credentials);
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

function run(params) {
    getCredentials(function(err, creds) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(creds);
    });
}

module.exports = {
    'run': run
};