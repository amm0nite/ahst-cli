
var request = require('request');
var config = require('./config.js');


var _token = '';

function setToken(token) {
    _token = token;
}

function createToken(credentials, next) {
    console.log('/access');

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
        
        next(null, data);
    });
}

function action(uri, data, next) {
    console.log(uri);
    
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

function refreshToken(next) {
    action('/refresh', null, next);
}

function createKey(next) {
    action('/robotKey', null, next);
}

function fetchUser(next) {
    action('/user', null, next);
}

function createJob(name, code, next) {
    var job = {
        name: name,
        code: code,
        launch: true
    };
    action('/job', job, next);
}

module.exports = {
    'setToken': setToken,
    'createToken': createToken,
    'refreshToken': refreshToken,
    'createJob': createJob,
    'createKey': createKey,
    'fetchUser': fetchUser,
};