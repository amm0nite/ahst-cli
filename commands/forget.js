
var fs = require('fs');
var disk = require('../disk.js');
var config = require('../config.js');

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
    fs.unlink(config.keyFile, function(err) {
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