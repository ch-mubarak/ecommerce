const Coupon = require("../models/coupon")

module.exports = {
    addCoupon: async (req, res) => {
        const { name, couponCode, discount, maxLimit, minPurchase } = req.body
        try {
            await Coupon.create({
                name: name.toUpperCase(),
                couponCode: couponCode.toUpperCase(),
                discount,
                maxLimit,
                minPurchase
            })
            res.redirect("/admin/coupons")
        } catch (err) {
            console.log(err)
            req.flash("message", "Error creating coupon")
            res.redirect("/admin/coupons")

        }
    },

    activate: async (req, res) => {
        const orderId = req.params.id
        try {
            await Coupon.findByIdAndUpdate(orderId, { isActive: true })
            res.status(201).json({ message: "coupon activated" })
        } catch (err) {
            res.status(500).json({ err })
        }
    },

    deactivate: async (req, res) => {
        const orderId = req.params.id
        try {
            await Coupon.findByIdAndUpdate(orderId, { isActive: false })
            res.status(201).json({ message: "coupon deactivated" })
        } catch (err) {
            res.status(500).json({ err })
        }
    }
}