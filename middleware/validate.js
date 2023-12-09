const { body } = require('express-validator')
const { validationResult } = require("express-validator");

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    next();
};

exports.validateSignUp = [
    body("firstName", "First name cannot be empty")
        .notEmpty()
        .trim()
        .escape(),
    body("lastName", "Last name cannot be empty")
        .notEmpty()
        .trim()
        .escape(),
    body("email", "Email must be a valid email address")
        .isEmail()
        .trim()
        .escape()
        .normalizeEmail(),
    body(
        "password",
        "Password must be at least 8 characters and at most 64 characters"
    ).isLength({ min: 8, max: 64 }),
];

exports.validateLogIn = [
    body("email", "Email must be a valid email address")
        .isEmail()
        .trim()
        .escape()
        .normalizeEmail(),
    body(
        "password",
        "Password must be at least 8 characters and at most 64 characters"
    ).isLength({ min: 8, max: 64 })
];

exports.validateEvent = [
    body("category", "Category cannot be empty and it must be one of the five categories provided.")
        .notEmpty()
        .trim()
        .escape()
        .isIn(["Athletics", "Academic", "Career", "Creative", "Other"]),
    body("title", "Title cannot be empty.")
        .notEmpty()
        .trim()
        .escape(),
    body("details", "Details must be at least 10 characters long.")
        .isLength({ min: 10 })
        .trim()
        .escape(),
    body("location", "Location cannot be empty.")
        .trim()
        .escape(),
    body("startDate", "Start date cannot be empty and it must be a valid ISO 8601 date.")
        .isISO8601()
        .trim()
        .escape(),
    body("endDate", "End date cannot be empty and it must be a valid ISO 8601 date.")
        .isISO8601()
        .trim()
        .escape()
        .custom((endDate, { req }) => {
            const startDate = req.body.startDate;
            if (startDate && endDate && new Date(startDate) < new Date(endDate)) {
                return true;
            } else {
                throw new Error("End date must come after start date.")
            }
        }),
    body("image", "Image cannot be empty")
];

exports.validateRsvp = [
    body("status", "Status must be Yes, No, or Maybe.")
        .notEmpty()
        .trim()
        .escape()
        .isIn(["YES", "NO", "MAYBE"]),
]

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash("error", error.msg);
        });
        return res.redirect("back");
    } else {
        return next();
    }
};