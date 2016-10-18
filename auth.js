
var config = require('./config.js');

function authenticate(next) {
    getStoredToken(next);
}

function getStoredToken(next) {
    fs.readFile(config.tokenFile, 'utf8', (err, content) => {
        try {
            if (err) throw err;
            var data = JSON.parse(content);
            return checkToken(data, next);
        }
        catch (e) {
            return getKey(next);    
        }
    });
}

function checkToken(tokenData, next) {
    api.checkToken(tokenData, function(err, data) {
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
    fs.readFile(config.tokenFile, 'utf8', (err, content) => {
        try {
            if (err) throw err;
            var data = JSON.parse(content);
            return login(data, next);
        }
        catch (e) {
            return askCredentials(next);
        }
    });
}

function login(creds, next) {
    api.getToken(creds, function(err, data) {
        if (err) return askCredentials(next);
        return next(data);
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
            return login(credentials, next);
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = authenticate;