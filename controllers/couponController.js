const Coupon = require("../models/coupon")
const User = require("../models/users")
const Cart = require("../models/cart")

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
            req.flash("message", "This Coupon already exist")
            res.redirect("/admin/coupons")

        }
    },

    redeem: async (req, res) => {
        const userId = req.user.id
        const couponCode = req.params.id
        try {
            const findCart = await Cart.findOne({ userId })
            const findCoupon = await Coupon.findOne({ couponCode })
            const user = await User.findById(userId)
            const totalPrice = findCart.total
            if (findCoupon?.isActive) {
                const isRedeemed = user.redeemedCoupons.includes(findCoupon.id)
                if (!isRedeemed) {
                    if (totalPrice >= findCoupon.minPurchase) {
                        const discount = ((totalPrice * findCoupon.discount) / 100).toFixed(2)
                        const couponDiscount = discount <= findCoupon.maxLimit ? Number(discount) : Number(findCoupon.maxLimit)
                        //saving coupon details to session
                        req.session.coupon = {
                            id: findCoupon.id,
                            code: findCoupon.couponCode,
                            discount: couponDiscount
                        }
                        return res.status(200).json({ couponDiscount: couponDiscount, totalPrice: totalPrice, message: "coupon is valid" })
                    } else {
                        req.session.coupon = null
                        return res.status(400).json({ message: `minimum purchase is ${findCoupon.minPurchase}`, minPurchase: findCoupon.minPurchase })
                    }
                } else {
                    req.session.coupon = null
                    return res.status(403).json({ message: "coupon already redeemed" })
                }
            } else {
                req.session.coupon = null
                return res.status(404).json({ message: "coupon is not valid" })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ err })
        }
    },

    removeCoupon: (req, res) => {
        req.session.coupon = null
        return res.status(201).json({})
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