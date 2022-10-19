require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const dbConfig = require("./config/dbConfig");
const passport = require("passport");
const oAuth = require("./auth/passport");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const User = require("./models/users");

const cors = require("cors");

const app = express();

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

app.set("view engine", "ejs");
app.set("layout", "layouts/masterLayout");
app.set("layout extractScripts", true);

app.use(cors());
app.use(express.static("public"));
app.use(expressLayout);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//facebook and google oAuth
oAuth();

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = true;
    res.locals.userName = req.user.name;
  }
  next();
});

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use(function (req, res, next) {
  res.status(404);
  if (req.accepts("html")) {
    res.render("errorPage/error", { layout: false });
    return;
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is up and running on port" + PORT));
