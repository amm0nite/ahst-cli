var api = require('../include/api.js');

function list(params, next) {
    api.fetchJobs(function(err, jobs) {
        if (err) return next(err);

        for (let index in jobs) {
            let job = jobs[index];
            console.log(job.id);
        }
    });
}

module.exports = list;