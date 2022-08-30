const express = require("express");
const router = express.Router();
const userControl = require("../controllers/userController")
const shopControl = require("../controllers/shopController")
const authentication = require("../middleware/authentication")
const {
    otpVerification,
    sendOtp
} = require("../middleware/otp");

router.get("/", shopControl.getHome)
router.get("/shop", shopControl.getAllProducts)
router.get("/shop/:category", shopControl.getShopByCategory)
router.get("/product/:id", shopControl.getProductById)
router.get("/checkout", (req, res) => {
    res.render("master/checkout")
})
router.get("/contact", (req, res) => {
    res.render("master/contact")
})
router.get("/login", authentication.checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("error")
    res.render("user/login", {
        errorMessage: errorMessage,
        layout: "layouts/layouts",
        extractScripts: true
    })
})
router.get("/register", authentication.checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/register", {
        errorMessage: errorMessage,
        layout: "layouts/layouts",
        extractScripts: true
    })
})
router.get("/error", (req, res) => {
    res.render("errorPage/error", { layout: false })
})

router.post("/validateOtp", otpVerification)
router.post("/resendOtp", (req, res) => {
    req.flash("message", "Otp resend successful")
    sendOtp(req, res)
})
router.post("/login", userControl.userLogin, (req, res) => {
    if (req.user.isAdmin === true) {
        res.redirect("/admin")
    }
    else {
        const redirectTo=req.session.returnTo
        res.redirect(redirectTo||"/")
        delete req.session.returnTo;
    }
})
router.post("/register", userControl.userRegister)

router.delete('/logout', userControl.userLogout)

module.exports = router