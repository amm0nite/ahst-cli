
var authenticate = require('./auth.js');

function main(action, params) {
    var command = require('./commands/' + action + '.js');
    var authRequired = ['generate', 'run'];
    if (authRequired.indexOf(action) != -1) {
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