
var fs = require('fs');
var api = require('../include/api.js');
var follower = require('../include/follower.js');

var _detach = false;
var _debug = true;

function run(params, next) {
    _detach = params.detach
    readFile(params.filename, next);
}

function readFile(filename, next) {
    fs.readFile(filename, 'utf8', function (err, code) {
        if (err) return next(err);
        return createJob(filename, code, next);
    });
}

function createJob(title, code, next) {
    api.createJob(title, code, function (err, job) {
        if (err) return next(err);

        if (_detach) {
            console.log('[' + job.id + ']');
            return next(null);
        }

        return followJob(job, next);
    });
}

function followJob(job, next) {
    var callback = follower.makeCallback();
    api.followJob(job.id, callback, function(err) {
        if (err) return next(err);
        return next(null);
    });
};

module.exports = run;