require("dotenv").config()
const express = require("express")
const expressLayout = require("express-ejs-layouts")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")
const flash = require("connect-flash")
const multer = require("multer")
const methodOverride = require("method-override")
const User = require("./models/users")
const app = express();

const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on("error", error => console.log(error))
db.once("open", () => console.log("mongoose is connected"))

app.set("view engine", "ejs")
app.set("layout", "layouts/layouts")
app.use(express.static("public"))
app.use(expressLayout)
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(flash())

app.use(express.static("public"))
app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", indexRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)


// app.use(function(req, res, next){
//     res.status(404);
//     if (req.accepts('html')) {
//       res.render('errorPage/error', { url: req.url,layout:false });
//       return;
//     }

//   });

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("server is up and running on port" + PORT))