require("dotenv").config()
const express= require("express")
const expressLayout=require("express-ejs-layouts")
const mongoose=require("mongoose")
const passport=require("passport")
const path=require("path")
const session=require("express-session")
const flash=require("connect-flash")
const multer=require("multer")
const methodOverride=require("method-override")
const User=require("./models/users")
const app=express();

const indexRouter=require("./routes/index")
const userRouter=require("./routes/user")
const adminRouter=require("./routes/admin")

const upload=multer({dest:"public/files"})

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db=mongoose.connection
db.on("error",error=>console.log(error))
db.once("open",()=>console.log("mongoose is connected"))

app.set("view engine","ejs")
app.set("layout","layouts/layouts")
app.use(express.static("public"))
app.use(expressLayout)
app.use(express.urlencoded({extended:false}))
app.use(methodOverride("_method"))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:60000
    }
}));
app.use(flash())

app.use(express.static("public"))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/",indexRouter)
app.use("/user",userRouter)
app.use("/admin",adminRouter)


const PORT=process.env.PORT||3000
app.listen(PORT,()=>console.log("server is up and running on port"+PORT))