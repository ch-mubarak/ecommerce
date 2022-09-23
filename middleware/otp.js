const nodemailer = require("nodemailer")
const Category = require("../models/category")
const User = require("../models/users")

function generateOtp() {
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log("Generated otp:" + otp)
    return otp
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

const otpVerification = async (req, res) => {
    let enteredOtp = Number(req.body.a + req.body.b + req.body.c + req.body.d + req.body.e + req.body.f)
    try {
        if (req.user.otp === enteredOtp) {
            await User.findByIdAndUpdate(req.user.id, { isVerified: true })
            res.redirect("/")
        } else {
            const allCategories = await Category.find()
            const hiddenEmail = hideEmail(req.user.email)
            res.render("optValidationForm", {
                email: hiddenEmail,
                errorMessage: "invalid otp",
                allCategories: allCategories
            })
        }
    } catch (err) {
        console.log(err)
        req.flash("message", "error verifying account")
        res.redirect("/register")
    }

}

const getOtpForm = async (req, res) => {
    try {
        const allCategories = await Category.find()
        const successMessage = req.flash("message")
        const hiddenEmail = hideEmail(req.user.email)
        res.render("optValidationForm", {
            successMessage: successMessage,
            email: hiddenEmail,
            allCategories: allCategories
        })
    } catch (err) {
        console.log(err)
        res.redirect("/")
    }
}

const sendOtp = async (req, res) => {
    let otp = generateOtp()
    try {
        await User.findByIdAndUpdate(req.user.id, { otp: otp })
        let info = await transporter.sendMail({
            to: req.user.email,
            subject: "Otp for registration is:", // Subject line
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
        });

        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
        req.flash("message", "error registering account")
        res.redirect("/register")
    }

}

module.exports = {
    sendOtp,
    otpVerification,
    getOtpForm
}