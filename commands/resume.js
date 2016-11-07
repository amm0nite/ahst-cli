var api = require('../include/api.js');
var follower = require('../include/follower.js');

function resume(params, next) {
    api.fetchJob(params.id, function(err, job) {
        if (err) return next(err);
        var callback = follower.makeCallback();
        return api.followJob(job.id, callback, next);
    });
}

module.exports = resume;