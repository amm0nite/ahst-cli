
var fs = require('fs');
var inquirer = require('inquirer');
var api = require('./api.js');
var config = require('./config.js');

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
    fs.readFile(config.keyFile, 'utf8', (err, content) => {
        if (err && err.code === "ENOENT") {
            console.error("No automation key file " + config.keyFile);
            return askCredentials(next);
        }

        if (err) {
            console.log("Failed to read " + config.keyFile);
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

        fs.readFile(params.filename, 'utf8', function (err, code) {
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

        api.createKey(function (err, result) {
            if (err) return next(err);

            var data = { username: creds.username, key: result.key };

            checkPath(function(err) {
                if (err) return next(err);

                fs.writeFile(config.keyFile, JSON.stringify(data), { mode: 0o600 }, function (err) {
                    if (err) return next(err);

                    console.log('Automation key saved to ' + config.keyFile);
                    next(null);
                });
            });
        });
    });
}

function checkPath(next) {
    fs.mkdir(config.dataDir, 0o700, function(err) {
        if (err && err.code === "EEXIST") {
            return next(null);
        }

        if (err) {
            return next(err);
        }

        return next(null);
    });
}

function forget(params, next) {
    checkPath(function() {
        fs.unlink(config.keyFile, function(err) {
            if (err && err.code === "ENOENT") {
                return next(null);
            }
        
            if (err) {
                return next(err);
            }

            next(null);
        });
    });

}

module.exports = {
    'run': run,
    'generate': generate,
    'forget': forget,
};