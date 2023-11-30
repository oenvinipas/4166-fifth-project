const model = require("../models/eventsModel");

exports.renderIndex = async (req, res) => {
  const events = await model.find().lean().catch(err => next(err));
  res.render("index", { events });
};

exports.renderAbout = (req, res) => {
  res.render("about");
};

exports.renderContact = (req, res) => {
  res.render("contact");
};
