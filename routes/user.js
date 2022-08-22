const express = require("express")

const {
    checkLoggedIn,
    changePassword,
    checkAccountVerified
} = require("../controllers/userController")

const router = express.Router()

router.use(checkLoggedIn)

router.get("/home",checkAccountVerified, (req, res) => {
    res.render("user/home",{layout:"layouts/layouts"})
})

router.get("/changePassword",checkAccountVerified,(req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/changePassword", { errorMessage: errorMessage,layout:"layouts/layouts" })
})

router.put("/changePassword", changePassword)


module.exports = router