var Table = require('tty-table');
var api = require('../include/api.js');

var _header = [
    { value:"id", alias:"Id", headerColor:"cyan", width:10 },
    { value:"name", alias:"Name", headerColor:"cyan", width:20 },
    { value:"createdAt", alias:"Created", headerColor:"cyan", width:30 },
];

function list(params, next) {
    api.fetchJobs({ running: true }, function(err, jobs) {
        if (err) return next(err);

        if (params.json) {
            console.log(JSON.stringify(jobs, null, 2));
            return next(null);
        }

        var table = new Table(_header, jobs);
        console.log(table.render());
        return next(null);
    });
}

module.exports = list;