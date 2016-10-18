function run(params, next) {
    authenticate(function (err) {
        if (err) return next(err);

        fs.readFile(params.filename, 'utf8', function (err, code) {
            if (err) return next(err);

            api.createJob(params.filename, code, function (err, job) {
                if (err) return next(err);

                console.log('[' + job.id + ']');
                next(null);
            });
        });
    });
}