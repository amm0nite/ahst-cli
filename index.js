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
    });

program.command('generate')
    .description('Create API token file')
    .action(function () {
        action = 'generate';
    });

program.command('forget')
    .description('Delete API token file')
    .action(function() {
        action = 'forget';
    });

program.parse(process.argv);

if (action == 'none') {
    program.help();
}

main(action, params);

