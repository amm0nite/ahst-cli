
var program = require('commander');
var package = require('./package.json');

program
    .version(package.name + " " + package.version)
    .command('run <filename>')
    .description('Run script')
    .option("-d, --detach", "Do not wait for output")
    .action(function(filename, options) {
        console.log(filename);
        console.log(options.detach);
    });

program.parse(process.argv);