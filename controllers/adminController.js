const _ = require("lodash")
const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")
const Order = require("../models/order")
const Coupon = require("../models/coupon")

module.exports = {

    home: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const orderStatusPending = await Order.find({ status: "Pending" }).countDocuments()
            const orderStatusDelivered = await Order.find({ status: "Delivered" }).countDocuments()
            const orderStatusCancelled = await Order.find({ status: "Cancelled" }).countDocuments()
            const orderStatusCount = [orderStatusPending, orderStatusDelivered, orderStatusCancelled]
            const users = await User.find({}).sort({ createdAt: -1 }).exec()
            res.render("admin/index", {
                users: users,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout",
                orderStatusCount: orderStatusCount,
                extractScripts: true
            })
        } catch (err) {
            console.log(err.message)
            res.redirect("/")

        }
    },

    categories: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
            res.render("admin/categoryManagement", {
                allCategories: allCategories,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout",
                extractScripts: true
            })
        } catch (err) {
            console.log(err.message)
            res.redirect("/")

        }
    },

    products: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
            const allProducts = await Product.find().populate("category").sort({ createdAt: -1 }).exec()
            res.render("admin/productManagement", {
                allCategories: allCategories,
                allProducts: allProducts,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout",
                extractScripts: true
            })
        } catch (err) {
            console.log(err.message)
            res.redirect("/")

        }
    },

    orders: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const allOrders = await Order.find().populate([
                {
                    path: "userId",
                    model: "User"
                },
                {
                    path: "products.productId",
                    model: "Product"
                }
            ]).sort({createdAt:-1}).exec()
            res.render("admin/orderManagement", {
                allOrders: allOrders,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout",
                extractScripts: true
            })
        } catch (err) {
            console.log(err)
            req.flash("message", "Error getting order details")
            res.redirect("/admin")

        }
    },

    coupons: async (req, res) => {
        const allCoupons = await Coupon.find().sort({ createdAt: -1 }).exec()
        const errorMessage = req.flash("message")
        res.render("admin/couponManagement", {
            allCoupons: allCoupons,
            errorMessage: errorMessage,
            layout: "layouts/adminLayout",
            extractScripts: true
        })
    },

    orderDetails: async (req, res) => {
        try {
            const orderId = req.params.id
            const myOrder = await Order.findById(orderId).populate([
                {
                    path: "userId",
                    model: "User"
                },
                {
                    path: "products.productId",
                    model: "Product"
                },
                {
                    path: "coupon",
                    model: "Coupon"
                }
            ]).exec()
            console.log(myOrder)
            if (myOrder) {
                res.render("admin/orderDetails",
                    {
                        myOrder: myOrder,
                        layout: "layouts/adminLayout",
                        extractScripts: true
                    }
                )
            } else {
                req.flash("message", "Invalid orderId")
                res.redirect("/admin/orders")
            }
        } catch (err) {
            req.flash("message", "Invalid orderId")
            res.redirect("/admin/orders")
            console.log(err)
        }
    },

    addCategory: async (req, res) => {
        try {
            const category = new Category({
                categoryName: _.startCase(_.toLower(req.body.categoryName))
            })
            await category.save()
            res.redirect("/admin/categories")

        } catch (err) {
            console.log(err.message)
            req.flash("message", "category already exists")
            res.redirect("/admin/categories")

        }
    },

    editCategory: async (req, res) => {
        try {
            await Category.findByIdAndUpdate(
                req.params.id,
                { categoryName: _.startCase(_.toLower(req.body.categoryName)) })
            res.redirect("/admin/categories")
        }
        catch (err) {
            console.log(err.message)
            req.flash("message", "Error editing in category")
            res.redirect("/admin/categories")
        }
    },

    deleteCategory: async (req, res) => {
        let category
        try {
            category = await Category.findById(req.params.id)
            await category.remove()
            res.redirect("/admin/categories")
        } catch (err) {
            console.log(err.message)
            if (category == null) {
                res.redirect("/admin")
            } else {
                req.flash("message", err.message)
                res.redirect("/admin/categories")
            }

        }
    },

    blockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(
                req.params.id,
                { isActive: false })
            res.redirect("/admin")
        } catch (err) {
            console.log(err.message)
            req.flash("message", "Error blocking User")
            res.redirect("/admin")
        }
    },

    unblockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { isActive: true })
            res.redirect("/admin")
        } catch (error) {
            console.log(err.message)
            req.flash("message", "Error un blocking User")
            res.redirect("/admin")
        }
    }

}





