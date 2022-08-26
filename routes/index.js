const express = require("express");
const router = express.Router();
const Product = require("../models/product")
const Category = require("../models/category")
const userControl = require("../controllers/userController")
const {
    otpVerification,
    sendOtp
} = require("../middleware/otp")


router.get("/", async (req, res) => {
    try {
        const allCategories = await Category.find()
        const allProducts = await Product.find().populate("category").sort({ createdAt: -1 }).exec()
        res.render("master/index", {
            allCategories: allCategories,
            allProducts: allProducts
        })
    } catch (err) {
        console.log(err)
        res.render("errorPage/error", { layout: false })
    }
})

router.get("/cart", (req, res) => {
    res.render("master/cart")
})

router.get("/shop", async (req, res) => {
    try {
        const allCategories = await Category.find()
        const allProducts = await Product.find().populate("category").sort({ createdAt: -1 }).exec()
        res.render("master/shop", {
            allCategories: allCategories,
            allProducts: allProducts
        })
    } catch (err) {
        console.log(err)
        res.render("errorPage/error", { layout: false })
    }
    
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
    res.render("user/login", {
        errorMessage: errorMessage,
        layout: "layouts/layouts",
        extractScripts: true
    })
})

router.get("/register", userControl.checkLoggedOut, (req, res) => {
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
        res.redirect("/user/home")
    }
})

router.post("/register", userControl.userRegister)

router.delete('/logout', userControl.userLogout)


module.exports = router