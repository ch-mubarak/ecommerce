const express = require("express");
const router = express.Router();
const userControl = require("../controllers/userController")
const {
    otpVerification,
    sendOtp
} = require("../controllers/otpController")


router.get("/", (req, res) => {
    res.render("master/index")
})

router.get("/cart", (req, res) => {
    res.render("master/cart")
})

router.get("/shop", (req, res) => {
    res.render("master/shop")
})

router.get("/product", (req, res) => {
    res.render("master/productDetails")
})

router.get("/checkout", (req, res) => {
    res.render("master/checkout")
})

router.get("/contact", (req, res) => {
    res.render("master/contact")
})

router.get("/login", userControl.checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("error")
    res.render("user/login", { errorMessage: errorMessage, layout: "layouts/layouts" })
})

router.get("/register", userControl.checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/register", { errorMessage: errorMessage, layout: "layouts/layouts" })
})

router.get("/error", (req, res) => {
    res.render("errorPage/error", { layout: false })
})

router.post("/validateOtp", otpVerification)

router.post("/resendOtp", sendOtp)

router.post("/login", userControl.userLogin, (req, res) => {
    if (req.user.isAdmin === true) {
        res.redirect("/admin")
    }
    else {
        res.redirect("/user/home")
    }
})

router.post("/register", userControl.userRegister)

router.delete('/logout', userControl.userLogout)


module.exports = router