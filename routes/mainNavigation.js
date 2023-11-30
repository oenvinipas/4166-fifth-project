const express = require("express");
const mainRouter = express.Router();
const controller = require('../controllers/mainController')

mainRouter.get('/', controller.renderIndex);

mainRouter.get("/about", controller.renderAbout);

mainRouter.get("/contact", controller.renderContact);

module.exports = mainRouter;