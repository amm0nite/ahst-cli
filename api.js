
var request = require('request');
var config = require('./config.js');

var _credentials = {};
var _token = '';

function setCredentials(credentials) {
    _credentials = credentials;
}

function setToken(token) {
    _token = token;
}

function getToken(next) {
    request({
        baseUrl: config.baseUrl,
        uri: '/access',
        method: 'POST',
        json: _credentials
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

module.exports = {
    'setCredentials': setCredentials,
    'createJob': createJob,
    'createKey': createKey,
};