const express = require("express");
const router = express.Router();
const userControl = require("../controllers/userController")
const shopControl = require("../controllers/shopController")
const authentication = require("../middleware/authentication")
const {
    otpVerification,
    getOtpForm,
    sendOtp
} = require("../middleware/otp");

router.get("/", authentication.checkAccountVerifiedInIndex, shopControl.getHome)
router.get("/shop", authentication.checkAccountVerifiedInIndex, shopControl.getAllProducts)
router.get("/shop/:category", authentication.checkAccountVerifiedInIndex, shopControl.getShopByCategory)
router.get("/product/:id", authentication.checkAccountVerifiedInIndex, shopControl.getProductById)
router.get("/contact", authentication.checkAccountVerifiedInIndex, (req, res) => res.render("master/contact"))

router.get("/login", authentication.checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("error")
    res.render("master/login", {
        errorMessage: errorMessage,
    })
})
router.get("/register", authentication.checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("message")
    res.render("master/register", {
        errorMessage: errorMessage,
    })
})

router.get("/error", (req, res) => {
    res.render("errorPage/error", { layout: false })
})

router.post("/validateOtp", otpVerification)

router.post("/resendOtp", async (req, res) => {
    getOtpForm(req, res)
    await sendOtp(req, res)
    req.flash("message", "Otp resend successful")
})
router.post("/login", userControl.userLogin, (req, res) => {
    if (req.user.isAdmin === true) {
        res.redirect("/admin")
    }
    else {
        res.redirect("/")
    }
})
router.post("/register", userControl.userRegister)

router.delete('/logout', userControl.userLogout)

module.exports = router