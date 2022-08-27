const { sendOtp } = require("./otp")

module.exports = {
    checkLoggedOut: (req, res, next) => {
        if (req.isAuthenticated() && req.user.isAdmin) {
            res.redirect("/admin")
        }
        else if (req.isAuthenticated()) {
            res.redirect("/user/home")
        }
        else {
            next()
        }
    },

    checkLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            next()
        }
        else {
            req.flash("message", "Pls login to access home")
            res.redirect("/")
        }
    },

    checkAccountVerified: async function (req, res, next) {
        if (req.user.isVerified) {
            next()
        }
        else {
            sendOtp(req, res)
        }
    },

    checkAdminPrivilege: function (req, res, next) {
        if (req.user.isAdmin) {
            next()
        }
        else {
            res.redirect("/error")
        }
    },

}