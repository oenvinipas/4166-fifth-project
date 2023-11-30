const express = require("express");
const userRouter = express.Router();
const controller = require("../controllers/userController");
const { isGuest, isLoggedIn } = require("../middleware/auth")

//GET /users/new - send html form for creating a new user
userRouter.get('/new', isGuest, controller.getNewPage);

// POST /users - create a new user
userRouter.post('/', isGuest, controller.createUser);

//GET /users/login - send html form for login page
userRouter.get('/login', isGuest, controller.getLoginPage);

//POST /users/login - authenticate user's login
userRouter.post('/login', isGuest, controller.processLogin);

//GET /users/profile - get users's profile page
userRouter.get('/profile', isLoggedIn, controller.getProfilePage)

//Logging out user
userRouter.get('/logout', isLoggedIn, controller.logout);

module.exports = userRouter;