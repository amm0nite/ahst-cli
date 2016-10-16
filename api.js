
var request = require('request');

var __baseUrl = 'https://api.ahst.fr';
var __credentials = {};

function setCredentials(credentials) {
    __credentials = credentials;
}

function authenticate(next) {
    request({
        baseUrl: __baseUrl,
        uri: '/access',
        method: 'POST',
        json: __credentials
    }, function (err, res) {
        if (err) return next(err);
        if (res.statusCode != 200) return next(res.body);

        var data = res.body;
        next(null, data.token);
    });
}

function action(uri, data, next) {
    authenticate(function (err, token) {
        if (err) return next(err);

        var options = {
            baseUrl: __baseUrl,
            headers: { 'Authorization': 'Bearer ' + token },
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

            next(null, res.body);
        });
    });
}

function postJob(name, code, next) {
    var job = {
        name: name,
        code: code,
        launch: true
    };
    action('/job', job, next);
}

function postKey(next) {
    var key = {};
    action('/key', key, next);
}

module.exports = {
    'setCredentials': setCredentials,
    'createJob': postJob,
    'createKey': postKey,
};