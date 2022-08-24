const User = require("../models/users")
const nodemailer = require("nodemailer")
const passport = require("passport")

function generateOtp() {
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log("Generated otp:" + otp)
    return otp
}


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 456,
    secure: true,
    service: "Gmail",

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
})

const userRegister = (req, res) => {
    if (req.body.password === req.body.confirmedPassword) {
        User.register({
            name: req.body.name,
            email: req.body.email,
        }, req.body.password, async function (err, user) {
            if (err) {
                console.log(err)
                req.flash("message", "User Already registered")
                res.redirect("/register")
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/user/home")
                })

            }
        })
    }
    else {
        req.flash("message", "password doesn't match")
        res.redirect("/register")
    }
}



const otpVerification = async (req, res) => {
    let enteredOtp = Number(req.body.a + req.body.b + req.body.c + req.body.d + req.body.e + req.body.f)
    try {
        if (req.user.otp === enteredOtp) {
            await User.findByIdAndUpdate(req.user.id, { isVerified: true })
            res.redirect("/user/home")
        } else {
            const hiddenEmail = hideEmail(req.user.email)
            res.render("optValidationForm", { email: hiddenEmail, errorMessage: "invalid otp", layout: "layouts/layouts" })
        }
    } catch (err) {
        console.log(err)
        req.flash("message", "error verifying account")
        res.redirect("/register")
    }

}

const resendOtp = async (req, res) => {
    let otp = generateOtp()
    try {
        await User.findByIdAndUpdate(req.user.id, { otp: otp })
        let info = await transporter.sendMail({
            to: req.user.email,
            subject: "Otp for registration is:", // Subject line
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
        });
        const hiddenEmail = hideEmail(req.user.email)
        res.render("optValidationForm", { layout: "layouts/layouts", email: hiddenEmail })
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
        req.flash("message", "error registering account")
        res.redirect("/register")
    }

}

async function checkAccountVerified(req, res, next) {
    if (req.user.isVerified) {
        next()
    }
    else {
        resendOtp(req, res)
    }
}

const userLogin = passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
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
                res.redirect("/user/home")
            }
        })
    }
    else {
        req.flash("message", "password doesn't match")
        res.redirect("changePassword")
    }
}


function checkLoggedOut(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        res.redirect("/admin")
    }
    else if (req.isAuthenticated()) {
        res.redirect("/user/home")
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


function hideEmail(target) {
    let email = target
    let hiddenEmail = "";
    for (i = 0; i < email.length; i++) {
        if (i > 2 && i < email.indexOf("@")) {
            hiddenEmail += "*";
        } else {
            hiddenEmail += email[i];
        }
    }
    return hiddenEmail
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    checkLoggedOut,
    checkLoggedIn,
    changePassword,
    checkAccountVerified,
    resendOtp,
    otpVerification
}