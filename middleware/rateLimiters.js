const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowsMs: 1000 * 60, //one minute
    max: 5,
    handler: (req, res, next) => {
        let err = new Error("Too many login requests. Try again later");
        err.status = 429; //too many requests error code
        return next(err);
    },
});
