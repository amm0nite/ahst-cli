
var fs = require('fs');
var api = require('../api.js');

function run(params, next) {
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
        console.log('[' + job.id + ']');
        return next(null);
    });
}

module.exports = run;