const User = require("../models/users")
const passport = require("passport")


const userRegister = (req, res) => {

    if (req.body.password === req.body.confirmedPassword) {
        User.register({
            name: req.body.name,
            email: req.body.email
        }, req.body.password, function (err, user) {
            if (err) {
                console.log(err)
                req.flash("message", "User Already registered")
                res.redirect("register")
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("user/home")
                })
            }
        })
    }
    else {
        req.flash("message", "password doesn't match")
        res.redirect("register")
    }
}

const userLogin = passport.authenticate('local', {
    successRedirect: 'user/home',
    failureFlash: true,
    failureRedirect: '/login'
});


const userLogout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err)
        } else {
            req.flash("logoutMessage", "you have successfully logout")
            res.redirect('/')
        }
    })
}

const changePassword = (req, res) => {
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.password
    const confirmedPassword = req.body.confirmedPassword
    const user = req.user
    if (newPassword === confirmedPassword) {
        user.changePassword(oldPassword, newPassword, function (err) {
            if (err) {
                console.log(err)
                req.flash("message", "wrong credentials")
                res.redirect("changePassword")
            }
            else {
                res.redirect("home")
            }
        })
    }
    else {
        req.flash("message", "password doesn't match")
        res.redirect("changePassword")
    }
}


function checkLoggedOut(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect("user/home")
    }
    else {
        next()
    }
}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        req.flash("message", "Pls login to access home")
        res.redirect("/")
    }
}



module.exports = {
    userRegister,
    userLogin,
    userLogout,
    checkLoggedOut,
    checkLoggedIn,
    changePassword
}