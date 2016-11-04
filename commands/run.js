
var fs = require('fs');
var api = require('../api.js');

var _detach = false;

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
    api.followJob(job.id, function(report) {
        console.log(report.stdout);
    });
};

module.exports = run;