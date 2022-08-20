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
    const logoutMessage=req.flash("message")
    res.render("index",{logoutMessage:logoutMessage})

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