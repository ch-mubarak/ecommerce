const express = require("express")
const router = express.Router();

const {
    userRegister,
    userLogin,
    userLogout,
    checkLoggedOut

} = require("../controllers/userController")

router.use(checkLoggedOut)

router.get("/", (req, res) => {
    const errorMessage = req.flash("message")
    const logoutMessage = req.flash("logoutMessage")
    res.render("index", { errorMessage: errorMessage, logoutMessage: logoutMessage })

})

router.get("/login", (req, res) => {
    const errorMessage = req.flash("error")
    res.render("user/login", { errorMessage: errorMessage })
})


router.get("/register", (req, res) => {
    const errorMessage = req.flash("message")
    res.render("user/register", { errorMessage: errorMessage })
})

router.get("/error", (req, res) => {
    res.render("errorPage/error")
})

router.post("/login", userLogin)

router.post("/register", userRegister)

router.delete('/logout', userLogout)


module.exports = router