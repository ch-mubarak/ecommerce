const User = require("../models/users")
const nodemailer = require("nodemailer")
const passport = require("passport")

var emailId
let otp = Math.random() * 1000000
otp = parseInt(otp)
console.log(otp)

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
    emailId = req.body.email
    if (req.body.password === req.body.confirmedPassword) {
        User.register({
            name: req.body.name,
            email: req.body.email
        }, req.body.password, async function (err, user) {
            if (err) {
                console.log(err)
                req.flash("message", "User Already registered")
                res.redirect("register")
            }
            else {
                passport.authenticate("local")(req, res, function () {
                })
                try {
                    let info = await transporter.sendMail({
                        to: emailId,
                        subject: "Otp for registration is:", // Subject line
                        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
                    });
                    const hiddenEmail=hideEmail(emailId)
                    res.render("optValidationForm",{email:hiddenEmail})
                    console.log("Message sent: %s", info.messageId);
                } catch (err) {
                    console.log(err)
                    req.flash("message", "error registering account")
                    res.redirect("/register")
                }
            }
        })
    }
    else {
        req.flash("message", "password doesn't match")
        res.redirect("register")
    }
}


const otpVerification = async (req, res) => {
    let enteredOtp = req.body.a + req.body.b + req.body.c + req.body.d + req.body.e + req.body.f
    enteredOtp = Number(enteredOtp)
    try {
        if (otp == enteredOtp) {
            await User.findByIdAndUpdate(req.user.id, { isVerified: true })
            res.redirect("/user/home")
        } else {
            res.render("optValidationForm", { errorMessage: "invalid otp" })
        }
    } catch (err) {
        console.log(err)
        req.flash("message", "error verifying account")
        res.redirect("/register")
    }

}
const resendOtp = async (req, res) => {
    try {
        let info = await transporter.sendMail({
            to: emailId || req.user.email,
            subject: "Otp for registration is:", // Subject line
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
        });
        res.render("optValidationForm")
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
        req.flash("message", "error registering account")
        res.redirect("/register")
    }

}

const userLogin = passport.authenticate('local', {
    successRedirect: '/user/home',
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
    if (req.isAuthenticated()) {
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
      if (i > 2 && i< email.indexOf("@") ) {
        hiddenEmail += "*";
      } else {
        hiddenEmail += email[i];
      }
    }
    return hiddenEmail
  }

async function checkAccountVerified(req, res, next) {
    if (req.user.isVerified) {
        next()
    }
    else {   
        try {
            let info = await transporter.sendMail({
                to: emailId||req.user.email,
                subject: "Otp for registration is:",
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
            });
            const hiddenEmail=hideEmail(req.use.email)
            res.render("optValidationForm",{email:hiddenEmail})
            console.log("Message sent: %s", info.messageId);
        } catch (err) {
            console.log(err)
            req.flash("message", "error registering account")
            res.redirect("/register")
        }
    }
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