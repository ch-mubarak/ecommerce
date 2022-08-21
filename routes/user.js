const express = require("express")

const {
    checkLoggedIn,
    changePassword,
} = require("../controllers/userController")

const router = express.Router()

router.get("/home", checkLoggedIn, (req, res) => {
    res.render("user/home")
})

router.get("/changePassword",checkLoggedIn, (req, res) => {
    const errorMessage=req.flash("message")
    res.render("user/changePassword",{errorMessage:errorMessage})
})

router.put("/changePassword", changePassword)


module.exports = router