function generate(params, next) {
    authenticate(function (err) {
        if (err) return next(err);

        api.getUser(function(err, user) {
            if (err) return next(err);

            api.createKey(function (err, result) {
                if (err) return next(err);

                var data = { username: user.username, key: result.key };

                checkPath(function(err) {
                    if (err) return next(err);

                    fs.writeFile(config.keyFile, JSON.stringify(data), { mode: 0o600 }, function (err) {
                        if (err) return next(err);

                        console.log('Automation key saved to ' + config.keyFile);
                        next(null);
                    });
                });
            });
        });
    });
}