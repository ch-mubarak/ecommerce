require("dotenv").config()
const express = require("express")
const expressLayout = require("express-ejs-layouts")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const flash = require("connect-flash")
const methodOverride = require("method-override")
const User = require("./models/users")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook")
const cors = require("cors")

const app = express();

const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on("error", error => console.log(error))
db.once("open", () => console.log("mongoose is connected"))

app.set("view engine", "ejs")
app.set("layout", "layouts/masterLayout")
app.set("layout extractScripts", true)

app.use(cors())
app.use(express.static("public"))
app.use(expressLayout)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride("_method"))

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(flash())

app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(express.static("public"))
app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://mystyle.codestreak.in/auth/google/myStyle",
  scope: ['email', 'profile']
},
  function (accessToken, refreshToken, profile, done) {
    //check user table for anyone with a facebook ID of profile.id
    User.findOne({
      $or: [
        { 'google.id': profile.id },
        { 'email': profile.emails[0].value }
      ]
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      //No user was found... so create a new user with values from google (all the profile. stuff)
      if (user) {
        if (!user.google.id) {
          user.google.id = profile.id
          user.google.token = accessToken;
          user.google.email = profile.emails[0].value;
          user.google.name = profile.name.displayName;
          user.save();
        }
        return done(null, user);
      } else {
        let newUser = new User()
        newUser.name = profile.displayName
        newUser.email = profile.emails[0].value
        newUser.isVerified = true
        newUser.havePassword = false
        newUser.google.id = profile.id
        newUser.google.token = accessToken
        newUser.google.email = profile.emails[0].value
        newUser.google.name = profile.name.displayName

        newUser.save(function (err) {
          if (err) {
            console.log(err);
            throw err
          }
          return done(null, newUser);
        });
      }
    })
  })
)

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://mystyle.codestreak.in/auth/facebook/myStyle",
  profileFields: ['id', 'displayName', 'email']
},
  function (accessToken, refreshToken, profile, done) {
    //check user table for anyone with a facebook ID of profile.id
    User.findOne({
      $or: [
        { 'facebook.id': profile.id },
        { 'email': profile.emails[0].value }
      ]
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      //No user was found... so create a new user with values from google (all the profile. stuff)
      if (user) {
        if (!user.facebook.id) {
          user.facebook.id = profile.id
          user.facebook.token = accessToken;
          user.facebook.email = profile.emails[0].value;
          user.facebook.name = profile.name.displayName;
          user.save();
        }
        return done(null, user);
      } else {
        let newUser = new User()
        newUser.name = profile.displayName
        newUser.email = profile.emails[0].value
        newUser.isVerified = true
        newUser.havePassword = false
        newUser.facebook.id = profile.id
        newUser.facebook.token = accessToken
        newUser.facebook.email = profile.emails[0].value
        newUser.facebook.name = profile.name.displayName

        newUser.save(function (err) {
          if (err) {
            console.log(err);
            throw err
          }
          return done(null, newUser);
        });
      }
    })
  })
)

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = true
    res.locals.userName = req.user.name
  }
  next();
});

app.use("/", indexRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)


app.use(function (req, res, next) {
  res.status(404);
  if (req.accepts('html')) {
    res.render('errorPage/error', { layout: false });
    return;
  }

});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("server is up and running on port" + PORT))