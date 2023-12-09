const model = require("../models/eventsModel");
const rsvpModel = require("../models/rsvp");
const { DateTime } = require("luxon");

exports.index = async (req, res, next) => {
  const categories = await model.collection.distinct('category');
  const events = await model.find().lean().catch(err => next(err));
  events.forEach(event => {
    event.startDate = DateTime.fromJSDate(event.startDate).toLocaleString(
      DateTime.DATETIME_MED
    );
    event.endDate = DateTime.fromJSDate(event.endDate).toLocaleString(
        DateTime.DATETIME_MED
    );
  })
  const categoryEvents = categories.map(category => {
    return { title: category, events: events.filter(event => event.category === category) }
  })
  res.render('events/index', { categoryEvents })
};

exports.newEvent = (req, res) => {
  res.render("./events/newEvent");
};

exports.postEvent = (req, res, next) => {
  let event = new model(req.body);
  event.host = req.session.user;

  let image = "/images/";
  if (!req.file) {
    event.image = "/images/fillerImage.jpg"
  } else {
    event.image = image + req.file.filename;
  }

  event.save()
    .then((event) => {
      req.flash("success", "Event created successfully")
      res.redirect("/events");
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        req.flash("error", "Validation error");
        res.redirect('back')
      }
      next(err)
    })
};

exports.handleRSVP = async (req, res, next) => {
  const eventId = req.params.id
  const userId = req.session.user
  const { status } = req.body;

  try {
    await rsvpModel.findOneAndUpdate(
      { eventId, userId },
      { status },
      { upsert: true, new: true }
    );

    req.flash("success", "RSVP saved successfully")
    res.redirect('/users/profile')

  } catch (err) {
    next(err);
  }
  
};

exports.getEventById = async (req, res, next) => {
  try {
    let eventId = req.params.id;
    console.log("coming from eventController.js", eventId);

    const event = await model.findById(eventId)
      .lean()
      .populate("host", "firstName lastName");

    if (event) {
      event.startDate = DateTime.fromJSDate(event.startDate).toLocaleString(
        DateTime.DATETIME_MED
      );
      event.endDate = DateTime.fromJSDate(event.endDate).toLocaleString(
        DateTime.DATETIME_MED
      );

      let numOfReservations = await rsvpModel.countDocuments({
        eventId,
        status: "YES",
      });

      res.render("./events/event", { event, numOfReservations });
    } else {
      let err = new Error("Cannot find a story with id" + eventId);
      err.status = 404;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

exports.editEvent = (req, res, next) => {
  let id = req.params.id;

  model.findById(id)
    .lean()
    .then(event => {
      if (event) {
        event.startDate = DateTime.fromJSDate(event.startDate).toISO({
          includeOffset: false,
        });
        event.endDate = DateTime.fromJSDate(event.endDate).toISO({
          includeOffset: false,
        });
        res.render("./events/edit", { event });
      }
    })
    .catch(err => {
      next(err);
    })
};

exports.updateEvent = (req, res, next) => {
  let id = req.params.id;
  let event = req.body;
  if (req.file) {
    event.image = `/images/${req.file.filename}`;
  } else {
    model.findById(id)
      .then(foundEvent => {
        event.image = foundEvent.image;
      })
      .catch(error => {
        let err = new Error("Cannot find image file");
        error.message = err
        error.status = 404;
        next(error);
      });

      req.flash("success", "Successfully edited event")
  }

  model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
    .then(event => {
      if (event) {
        res.redirect("/events/" + id);
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

exports.deleteEvent = (req, res, next) => {
  let id = req.params.id;
  
  model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event => {
      if (event) {
          rsvpModel.deleteMany({ eventId: id }, { useFindAndModify: false })
            .then(() => {
              res.redirect("/events");
            })
            .catch(err => next(err))
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err)
    })
    
    req.flash("success", "Successfully deleted event")
};
