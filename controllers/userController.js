const User = require('../models/user')
const Event = require('../models/eventsModel')
const Rsvp = require('../models/rsvp')

exports.getNewPage = (req, res) => {
    return res.render('./user/new')
}

exports.createUser = (req, res, next) => {
    let user = new User(req.body)
    if (user.email) user.email = user.email.toLowerCase()
    user.save()
        .then(user => {
            req.flash("success", "User created successfully")
            res.redirect('/users/login')
        })
        .catch(err => {
            if (err.name === "ValidationError") {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', "Email has been used");
                return res.redirect('/users/new');
            }

            next(err);
        });
}

exports.getLoginPage = (req, res) => {
    return res.render('./user/login')
}

exports.processLogin = (req, res, next) => {
    let email = req.body.email;
    if (email) email = email.toLowerCase()

    let password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', "Wrong email address");
                res.redirect('/users/login')
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user;
                            req.flash('success', 'You have successfully logged in.');
                            res.redirect('/users/profile');
                        } else {
                            req.flash('error', "Wrong password");
                            res.redirect('/users/login');
                        }
                    });
            };
        })
        .catch(err => next(err))
};

exports.getProfilePage = (req, res, next) => {
    let id = req.session.user;
    Promise.all([
        User.findById(id),
        Event.find({ host: id }),
        Rsvp.find({ userId: id }).populate("eventId")
    ]).then(result => {
        const [user, events, rsvps] = result;
        res.render('./user/profile',  { user, events, rsvps });
    }).catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/')
        }
    });
};