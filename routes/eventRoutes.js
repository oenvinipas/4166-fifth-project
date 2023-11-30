const express = require('express');
const eventRouter = express.Router();
const controller = require('../controllers/eventsController');
const { fileUpload } = require('../middleware/fileUpload');
const { isLoggedIn, isHost } = require("../middleware/auth")
const { validateId } = require("../middleware/validate")

// GET /events - send all events to the user
eventRouter.get('/', controller.index)

// GET /events/new - send html for creating a new event
eventRouter.get('/new', isLoggedIn, controller.newEvent);

// POST /events - create a new event and redirect user back to all of the events
eventRouter.post('/', isLoggedIn, fileUpload, controller.postEvent);

// GET /events/:id - send details for the event with the given id
eventRouter.get('/:id', validateId, controller.getEventById);

// GET /events/:id/edit - send details for the event that will be edited with the given id
eventRouter.get('/:id/edit', isLoggedIn, isHost, controller.editEvent);

// PUT /events/:id - update the event with the given id and redirect user back to all of the event with the given id
eventRouter.put("/:id", isLoggedIn, isHost, fileUpload, controller.updateEvent);

// DELETE /events/:id - delete the event with the given id
eventRouter.delete("/:id", isLoggedIn, isHost, controller.deleteEvent);


module.exports = eventRouter;