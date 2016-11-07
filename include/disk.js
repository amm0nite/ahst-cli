
var fs = require('fs');
var config = require('./config.js');

function checkPath(next) {
    fs.mkdir(config.dataDir, 0o700, function(err) {
        if (err && err.code === "EEXIST") {
            return next(null);
        }

        if (err) {
            return next(err);
        }

        return next(null);
    });
}

module.exports = {
    'checkPath': checkPath,
};