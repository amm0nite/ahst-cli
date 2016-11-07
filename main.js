
var authenticate = require('./include/auth.js');

function main(action, params) {
    var command = require('./commands/' + action + '.js');
    if (params.authRequired) {
        authenticate(function(err) {
            if (err) return errorHandler(err);
            execute(command, params);
        });
    }
    else {
        execute(command, params);
    }
}

function execute(command, params) {
    command(params, function (err) {
        if (err) return errorHandler(err);
    });
}

function errorHandler(err) {
    console.log('Error:');
    console.log(err);
}

module.exports = main;