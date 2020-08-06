const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const jquery = require("jquery");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

require("dotenv").config();

// HBS helpers
require("./helpers/handlebars")(hbs);

// DB Config Connection
require("./config/db.js");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 5500000 },
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    console.log('Esta es la session:', req.session)
    res.locals.isUserLoggedIn = true;

    if (res.locals.currentUserInfo.user.isCarer) {
      res.locals.isCarerLoggedIn = true;
    } else {
      res.locals.isCarerLoggedIn = false;
    }
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

app.use(cookieParser());

// Global variables

require('./socket');

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

const carer = require("./routes/carer");
app.use("/carer", carer);

const axios = require("./routes/axios");
app.use("/manage", axios);

const service = require("./routes/service");
app.use("/", service);

const feedback = require("./routes/feedback");
app.use("/", feedback);



module.exports = app;
