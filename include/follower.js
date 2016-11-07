
var _debug = true;

function makeCallback() {
    var callback = function(report) {
        if (_debug) {
            console.log('-');
            console.log(report);
            console.log('-');
        }
        if (report.stdout) {
            console.log(report.stdout);
        }
    };

    return callback;
}

module.exports = {
    'makeCallback': makeCallback,
};