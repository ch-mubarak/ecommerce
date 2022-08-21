const express = require("express")

const {
    checkLoggedIn,
    changePassword,
    checkAccountVerified
} = require("../controllers/userController")

const router = express.Router()

router.use(checkLoggedIn)
router.use(checkAccountVerified)

router.get("/home", (req, res) => {
    res.render("user/home")
})

router.get("/changePassword", (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/changePassword", { errorMessage: errorMessage })
})

router.put("/changePassword", changePassword)


module.exports = router