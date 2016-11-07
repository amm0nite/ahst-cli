
var fs = require('fs');
var disk = require('../include/disk.js');
var config = require('../include/config.js');

function forget(params, next) {
    checkPath(next);
}

function checkPath(next) {
    disk.checkPath(function(err) {
        if (err) return next(err);
        return unlink(next);
    });
}

function unlink(next) {
    fs.unlink(config.apiTokenFile, function(err) {
        if (err && err.code === "ENOENT") {
            return next(null);
        }
        
        if (err) {
            return next(err);
        }

        return next(null);
    });
}

module.exports = forget;