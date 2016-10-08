
var request = require('request');

var __baseUrl = 'https://api.ahst.fr';
var __credentials = null;

function setCredentials(credentials) {
    __credentials = credentials;
}

function authenticate(next) {
    request({
        baseUrl: __baseUrl,
        uri: '/access',
        method: 'POST',
        json: __credentials
    }, function(err, res) {
        if (err) return next(err);
        
        if (res.statusCode != 200) {
            return next(res.body);
        }
        
        var data = res.body;
        next(null, data.token);
    });
}

function postJob(code, next) {
    authenticate(function(err, token) {
        if (err) return next(err);
        console.log(token);
    });
}

module.exports = {
    'setCredentials': setCredentials,
    'createJob': postJob
};