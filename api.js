
var request = require('request');
var EventSource = require('eventsource');

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
        
        next(null, data);
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

function refreshToken(next) {
    action('/refresh', null, next);
}

function createApiToken(description, next) {
    action('/apiToken', { 'description': description }, next);
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

function followJob(id, callback, next) {
    var endpoint = config.baseUrl + '/job/'  + id + '/reports';
    var init = { headers: { 'Authorization': 'Bearer ' + _token }};
    var source = new EventSource(endpoint, init);

    source.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if (data.type && data.type == 'report') {
            var report = data.data;
            callback(data.data);

            if (report.status == 'down') {
                source.close();
                return next(null);
            }
        }
    };
    source.onerror = function(err) {
        source.close();
        return next(err);
    };
}

module.exports = {
    'setToken': setToken,
    'createToken': createToken,
    'refreshToken': refreshToken,
    'createApiToken': createApiToken,
    'createJob': createJob,
    'followJob': followJob,
    'fetchUser': fetchUser,
};