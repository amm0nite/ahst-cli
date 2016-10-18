function forget(params, next) {
    checkPath(function(err) {
        if (err) return next(err);
        
        fs.unlink(config.keyFile, function(err) {
            if (err && err.code === "ENOENT") {
                return next(null);
            }
        
            if (err) {
                return next(err);
            }

            next(null);
        });
    });
}