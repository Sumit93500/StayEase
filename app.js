const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);

const rootDir = require("./utils/pathUtil");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const errorsController = require("./controllers/errors");

const app = express();

// ENV VARIABLES
const DB_PATH = process.env.MONGO_URL || "mongodb+srv://root:root@cluster0.wzflac0.mongodb.net/airbnb?retryWrites=true&w=majority";
const SESSION_SECRET = process.env.SESSION_SECRET || "AirBnb";
const PORT = process.env.PORT || 3000;

// SESSION STORE (MongoDB)
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

store.on("error", (err) => {
  console.error("Session store error:", err);
});

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

// SESSION
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
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
  hostRouter
);

// STORE ROUTES
app.use(storeRouter);

// 404 PAGE
app.use(errorsController.pageNotFound);

// SERVER
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });