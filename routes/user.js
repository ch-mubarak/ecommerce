const express = require("express")
const userControl =require("../controllers/userController")
const authentication =require("../middleware/authentication")
const router = express.Router()

router.use(authentication.checkLoggedIn)

router.get("/home", authentication.checkAccountVerified, (req, res) => {
    res.render("user/home", {
        layout: "layouts/layouts",
        extractScripts: true
    })
})

router.get("/changePassword", authentication.checkAccountVerified, (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/changePassword", {
        errorMessage: errorMessage,
        layout: "layouts/layouts",
        extractScripts: true

    })
})

router.put("/changePassword", userControl.changePassword)


module.exports = router