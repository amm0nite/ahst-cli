
var request = require('request');
var config = require('./config.js');


var _token = '';

function setToken(token) {
    _token = token;
}

function createToken(credentials, next) {
    request({
        baseUrl: config.baseUrl,
        uri: '/access',
        method: 'POST',
        json: credentials
    }, function (err, res) {
        if (err) return next(err);

        var data = res.body;
        if (res.statusCode != 200) {
            data.code = res.statusCode;
            return next(data);
        }
        
        next(null, data.token);
    });
}

function action(uri, data, next) {
    var options = {
        baseUrl: config.baseUrl,
        headers: { 'Authorization': 'Bearer ' + _token },
        uri: uri,
        method: 'GET'
    };

    if (data) {
        options.method = 'POST';
        options.json = data;
    }

    request(options, function (err, res) {
        if (err) return next(err);
        if (res.statusCode != 200) return next(res.body);

        var result = res.body;
        if (!data) {
            result = JSON.parse(res.body);
        }

        next(null, result);
    });
}

function createJob(name, code, next) {
    var job = {
        name: name,
        code: code,
        launch: true
    };
    action('/job', job, next);
}

function createKey(next) {
    action('/robotKey', null, next);
}

function fetchUser(next) {
    action('/user', null, next);
}

function fetchToken(next) {
    throw "todo";
}

module.exports = {
    'setToken': setToken,
    'createToken': createToken,
    'createJob': createJob,
    'createKey': createKey,
    'fetchUser': fetchUser,
    'fetchToken': fetchToken,
};