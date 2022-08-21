const express= require("express")
const router=express.Router();

const passport = require("passport")
const User = require("../models/users")
const {
    userRegister,
    userLogin,
    userLogout,
    checkLoggedOut

}=require("../controllers/userController")


router.get("/",checkLoggedOut,(req,res)=>{
    const errorMessage=req.flash("message")
    const logoutMessage=req.flash("logoutMessage")
    res.render("index",{errorMessage:errorMessage,logoutMessage:logoutMessage})

})

router.get("/login",checkLoggedOut, (req, res) => {
    const errorMessage=req.flash("error")
    res.render("user/login",{errorMessage:errorMessage})
})


router.get("/register",checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/register",{errorMessage:errorMessage})
})

router.get("/error",(req,res)=>{
    res.render("errorPage/error")
})

router.post("/login",userLogin)

router.post("/register",userRegister)

router.delete('/logout', userLogout)


module.exports=router