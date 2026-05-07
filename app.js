const path = require("path");

const express = require("express");

const session = require("express-session");

const mongoose = require("mongoose");

const rootDir = require("./utils/pathUtil");

const storeRouter = require("./routes/storeRouter");

const hostRouter = require("./routes/hostRouter");

const authRouter = require("./routes/authRouter");

const errorsController = require("./controllers/errors");

const app = express();

const DB_PATH =
  "mongodb+srv://root:root@cluster0.wzflac0.mongodb.net/airbnb?retryWrites=true&w=majority";

// VIEW ENGINE
app.set("view engine", "ejs");

app.set("views", "views");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(rootDir, "public")));

// SESSION
app.use(
  session({
    secret: "AirBnb",
    resave: false,
    saveUninitialized: false,
  }),
);

// GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;

  res.locals.role = req.session.role || null;

  res.locals.user = req.session.user || null;

  next();
});

// AUTH ROUTES
app.use(authRouter);

// HOST PROTECTION + HOST ROUTES
app.use(
  "/host",

  (req, res, next) => {
    if (!req.session.isLoggedIn || req.session.role !== "host") {
      return res.redirect("/login");
    }

    next();
  },

  hostRouter,
);

// STORE ROUTES
app.use(storeRouter);

// 404 PAGE
app.use(errorsController.pageNotFound);

// SERVER
const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
