const User = require("../models/users")
const passport = require("passport")
const { sendOtp, getOtpForm } = require("../middleware/otp")

module.exports = {
    userRegister: (req, res, next) => {
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
                        process.nextTick(async () => {
                            await sendOtp(req, res)
                        })
                        res.redirect("/")
                    })

                }
            })
        }
        else {
            req.flash("message", "password doesn't match")
            res.redirect("/register")
        }
    },

    userLogin: passport.authenticate('local', {
        failureFlash: true,
        keepSessionInfo: true,
        failureRedirect: '/login',
    }),

    userLogout: (req, res) => {
        req.logout(function (err) {
            if (err) {
                console.log(err)
            } else {
                res.redirect('/')
            }
        })
    },

    changePassword: (req, res) => {
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.password
        const confirmedPassword = req.body.confirmedPassword
        const user = req.user
        if (newPassword === confirmedPassword) {
            user.changePassword(oldPassword, newPassword, function (err) {
                if (err) {
                    res.status(401).json({ message: "wrong credential" })
                }
                else {
                    res.status(201).json({ message: "password changed" })
                }
            })
        }
        else {
            res.status(403).json({ message: "password doesn't match" })
        }
    },

    removeAddress: async (req, res) => {
        try {
            const addressIndex = Number(req.params.index)
            const user = await User.findById(req.user.id)
            user.address.splice(addressIndex, 1)
            await user.save()
            return res.status(204).json({ message: "address removed" })
        } catch (err) {
            console.log(err)
            res.status(500)
        }
    },

    getProfile: async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId)
            res.render("master/profile", {
                user: user
            })
        } catch (err) {
            console.log(err)
        }
    },

    createAddress: async (req, res) => {
        try {
            const userId = req.user.id
            const myUser = await User.findById(userId)
            myUser.address.unshift({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                house: req.body.house,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                phone: req.body.phone
            })
            await myUser.save()
            res.status(201).json({ message: "new address created" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
        }
    },

}
