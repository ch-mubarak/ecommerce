const { sendOtp, getOtpForm } = require("./otp")

module.exports = {
    checkLoggedOut: (req, res, next) => {
        if (req.isAuthenticated() && req.user.isAdmin) {
            res.redirect("/admin")
        }
        else if (req.isAuthenticated()) {
            res.redirect("/")
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
            res.redirect("/login")
        }
    },

    checkAccountVerified: (req, res, next) => {
        if (req.user.isVerified) {
            next()
        }
        else {
            return getOtpForm(req, res)
        }
    },

    checkAccountVerifiedInIndex: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isVerified) {
                next()
            }
            else {
                return getOtpForm(req, res)
            }
        } else {
            next()
        }
    },

    checkAdminPrivilege: (req, res, next) => {
        if (req.user.isAdmin) {
            next()
        }
        else {
            res.redirect("/error")
        }
    },

}