//require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mainRoutes = require("./routes/mainNavigation");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash')

//create app
const app = express();

//config app
let port = 3000;
let host = "localhost";
let url = "mongodb+srv://sorozcob:mongoDBAtlasPass@cluster0.uslpjgr.mongodb.net/project3";
app.set("view engine", "ejs");

//middleware functions
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"))

//connect to MongoDB
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //start server
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
      console.log("DB has successfully started");
    });
  })
  .catch((err) => console.error(err));

app.use(
  session({
    secret: "fkasfjui1unfjek;rj0newoafna",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: url }),
    cookie: { maxAge: 60 * 60 * 1000 }
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

//setup routes
app.use("/", mainRoutes);

app.use('/events', eventRoutes);

app.use('/users', userRoutes);

//none of the routes were executed
app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url)
  err.status = 404;
  next(err);
});

//this error handler handles server errors
app.use((err, req, res, next) => {
  console.log(err.stack)
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render('Error', {error: err})
});
