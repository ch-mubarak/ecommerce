const express = require("express");
const router = express.Router();
const {
    userRegister,
    userLogin,
    userLogout,
    checkLoggedOut,
    // otpVerification,
    // resendOtp

} = require("../controllers/userController")

const {
    otpVerification,
    resendOtp

}=require("../controllers/otpController")


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

router.get("/login", checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("error")
    res.render("user/login", { errorMessage: errorMessage, layout: "layouts/layouts" })
})


router.get("/register", checkLoggedOut, (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/register", { errorMessage: errorMessage, layout: "layouts/layouts" })
})


router.get("/error", (req, res) => {
    res.render("errorPage/error", { layout: false })
})

router.post("/validateOtp", otpVerification)

router.post("/resendOtp", resendOtp)

router.post("/login", userLogin, (req, res) => {
    if (req.user.isAdmin === true) {
        res.redirect("/admin")
    }
    else {
        res.redirect("/user/home")
    }
})

router.post("/register", userRegister)

router.delete('/logout', userLogout)


module.exports = router