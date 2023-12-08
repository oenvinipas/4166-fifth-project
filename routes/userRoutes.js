const express = require("express");
const userRouter = express.Router();
const controller = require("../controllers/userController");
const { isGuest, isLoggedIn } = require("../middleware/auth")
const { logInLimiter } = require("../middleware/rateLimiters");
const { validateSignUp, validateLogIn, validateResult } = require("../middleware/validate")

//GET /users/new - send html form for creating a new user
userRouter.get('/new', isGuest, controller.getNewPage);

// POST /users - create a new user
userRouter.post('/', isGuest, validateSignUp, validateResult, controller.createUser);

//GET /users/login - send html form for login page
userRouter.get('/login', isGuest, controller.getLoginPage);

//POST /users/login - authenticate user's login
userRouter.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.processLogin);

//GET /users/profile - get users's profile page
userRouter.get('/profile', isLoggedIn, controller.getProfilePage)

//Logging out user
userRouter.get('/logout', isLoggedIn, controller.logout);

module.exports = userRouter;