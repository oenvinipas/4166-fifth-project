const Event = require('../models/eventsModel');

// check if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next()
    } else {
        req.flash("error", "You are logged in already");
        return res.redirect('/users/profile')
    }
}

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next()
    } else {
        req.flash("error", "You need to login first");
        return res.redirect('/users/login')
    }
};

// check if user is the host of the event
exports.isHost = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid event id");
        err.status = 400;
        return next(err);
    }

    Event.findById(id)
        .then(event => {
            if (event) {
                if (event.host._id == req.session.user._id) {
                    return next()
                } else {
                    let err = new Error("Unauthorized to access the resource");
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error("Cannot find a story with id: " + id);
                err.status = 400;
                return next(err);
            }
        })
        .catch(err => next(err))
}

// check if user is not the host of the event
exports.isNotHost = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid event id");
        err.status = 400;
        return next(err);
    }

    Event.findById(id)
        .then(event => {
            if (event) {
                if (event.host._id != req.session.user._id) {
                    return next()
                } else {
                    let err = new Error("Unauthorized to access the resource");
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error("Cannot find a story with id: " + id);
                err.status = 400;
                return next(err);
            }
        })
        .catch(err => next(err))
}