#!/usr/bin/env node

// I should have done this in python

var program = require('commander');
var info = require('./package.json');
var main = require('./main.js');

var action = 'none';
var params = {};

program.version(info.name + " " + info.version);

program.command('run <filename>')
    .description('Run script')
    .option("-d, --detach", "Do not wait for output")
    .action(function (filename, options) {
        action = 'run';
        params.filename = filename;
        params.detach = options.detach;
        params.authRequired = true;
    });

program.command('resume <id>')
    .description("Follow execution of a running script")
    .action(function(id) {
        action = 'resume';
        params.id = id;
        params.authRequired = true;
    });

program.command('ls')
    .description('List running jobs')
    .action(function() {
        action = 'list';
        params.authRequired = true;
    });

program.command('setup')
    .description('Create API token file')
    .action(function () {
        action = 'generate';
        params.authRequired = true;
    });

program.command('reset')
    .description('Delete API token file')
    .action(function() {
        action = 'forget';
    });

program.parse(process.argv);

if (action == 'none') {
    program.help();
}

main(action, params);

