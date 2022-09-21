const _ = require("lodash")
const Product = require("../models/product")
const Category = require("../models/category")
const Wishlist = require("../models/wishlist")
const Order = require("../models/order")
const Banner = require("../models/banner")

module.exports = {
    getHome: async (req, res) => {
        try {
            const primaryBanner = await Banner
                .findOne({ $and: [{ viewOrder: "primary" }, { isActive: true }] })
                .exec()
            const secondaryBanner = await Banner
                .find({ $and: [{ viewOrder: "secondary" }, { isActive: true }] })
                .sort({ createdAt: -1 })
                .limit(2)
                .exec()
            const allCategories = await Category.find();
            const allProducts = await Product.find()
                .populate("category")
                .sort({ createdAt: -1 })
                .limit(12).exec();
            res.render("master/index", {
                allCategories: allCategories,
                allProducts: allProducts,
                primaryBanner: primaryBanner,
                secondaryBanner: secondaryBanner
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const limit = 9
            const page = req.params.page || 1
            const minPrice = req.query.minPrice || 100
            const maxPrice = req.query.maxPrice || 5000
            const sortOrder = req.query.sort || "latest"
            let sort
            const priceRange = { $gt: minPrice, $lt: maxPrice }
            if (sortOrder == "asc") {
                sort = { price: 1 }
            } else if (sortOrder == "dsc") {
                sort = { price: -1 }
            } else {
                sort = { createdAt: -1 }
            }

            const allCategories = await Category.find()
            const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(6)
            const offerProducts = await Product.find().populate("category")
            const allProducts = await Product.find()
                .populate("category")
                .where("price")
                .equals(priceRange)
                .sort(sort)
                .skip((limit * page) - limit)
                .limit(limit)
                .exec()

            const count = await Product.find()
                .where("price")
                .equals(priceRange)
                .sort(sort)
                .countDocuments()

            res.render("master/shop", {
                allCategories: allCategories,
                allProducts: allProducts,
                offerProducts: offerProducts,
                latestProducts: latestProducts,
                minPrice: minPrice,
                maxPrice: maxPrice,
                sortOrder: sortOrder,
                current: page,
                limit: Math.ceil(count / limit),
                count: count
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }

    },

    getShopByCategory: async (req, res) => {
        try {
            const limit = 9
            const page = req.params.page || 1
            const minPrice = req.query.minPrice || 100
            const maxPrice = req.query.maxPrice || 5000
            const sortOrder = req.query.sort || "latest"
            let sort
            const priceRange = { $gt: minPrice, $lt: maxPrice }
            if (sortOrder == "asc") {
                sort = { price: 1 }
            } else if (sortOrder == "dsc") {
                sort = { price: -1 }
            } else {
                sort = { createdAt: -1 }
            }
            const allCategories = await Category.find()
            const paramsId = _.upperFirst(req.params.category)
            const findCategory = await Category
                .find({ categoryName: paramsId })

            const latestProducts = await Product
                .find({ category: findCategory[0].id })
                .sort({ createdAt: -1 })
                .limit(6)

            const findProducts = await Product
                .find({ category: findCategory[0].id })
                .where("price")
                .equals(priceRange)
                .sort(sort)
                .skip((limit * page) - limit)
                .limit(limit)
                .exec()


            //getting count of products for pagination

            const count = await Product
                .find({ category: findCategory[0].id })
                .where("price")
                .equals(priceRange)
                .sort(sort)
                .countDocuments()


            res.render("master/category", {
                allCategories: allCategories,
                findProducts: findProducts,
                latestProducts: latestProducts,
                findCategory: findCategory,
                minPrice: minPrice,
                maxPrice: maxPrice,
                sortOrder: sortOrder,
                category: paramsId,
                current: page,
                limit: Math.ceil(count / limit),
                count: count
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }

    },

    getProductById: async (req, res) => {
        try {
            const relatedProducts = await Product.find().limit(4).exec()
            const isInMyList = await Wishlist.exists()
                .where("userId")
                .equals(req.user?.id)
                .where("myList.productId")
                .equals(req.params.id)
            const findProduct = await Product.findById(req.params.id)
                .populate("category").exec()
            if (findProduct) {
                res.render("master/productDetails", {
                    findProduct: findProduct,
                    relatedProducts: relatedProducts,
                    isInMyList: isInMyList,
                })
            } else {
                res.render("errorPage/error", { layout: false })
            }
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }
    },

    getProductByKeyword: async (req, res) => {
        try {
            const limit = 9
            const page = req.params.page || 1
            const keyword = req.query.name || ""
            const minPrice = req.query.minPrice || 100
            const maxPrice = req.query.maxPrice || 5000
            const sortOrder = req.query.sort || "latest"
            let sort
            const priceRange = { $gt: minPrice, $lt: maxPrice }
            const newProducts = await Product.find().limit(3)
            if (sortOrder == "asc") {
                sort = { price: 1 }
            } else if (sortOrder == "dsc") {
                sort = { price: -1 }
            } else {
                sort = { createdAt: -1 }
            }
            const allCategories = await Category.find()

            const findProducts = await Product.find({
                "$or": [
                    { name: { $regex: keyword, $options: 'i' } },
                    { brand: { $regex: keyword, $options: 'i' } },
                ]
            })
                .populate("category")
                .where("price")
                .equals(priceRange)
                .sort(sort)
                .skip((limit * page) - limit)
                .limit(limit)
                .exec()

            const count = await Product.find({
                "$or": [
                    { name: { $regex: keyword, $options: 'i' } },
                    { brand: { $regex: keyword, $options: 'i' } },
                ]
            })
                .where("price")
                .equals(priceRange)
                .sort(sort)
                .countDocuments()

            res.render("master/search", {
                allCategories: allCategories,
                newProducts: newProducts,
                findProducts: findProducts,
                keyword: keyword,
                sortOrder: sortOrder,
                minPrice: minPrice,
                maxPrice: maxPrice,
                count: count,
                current: page,
                limit: Math.ceil(count / limit),
            })

        } catch (err) {
            console.log(err)
            res.redirect("/")
        }
    },

    autoFill: async (req, res) => {
        let searchKey = req.body.searchKey.trim()
        try {
            let searchResult = await Product.find({
                "$or": [
                    { name: { $regex: searchKey, $options: 'i' } },
                    { brand: { $regex: searchKey, $options: 'i' } },
                ]
            }).exec()
            searchResult = searchResult.slice(0, 5)
            res.send({ searchResult: searchResult })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
        }
    },

    myOrders: async (req, res) => {
        try {
            const userId = req.user.id
            const myOrders = await Order.find({ userId }).populate([
                {
                    path: "userId",
                    model: "User"
                },
                {
                    path: "products.productId",
                    model: "Product"
                }
            ]).sort({ createdAt: -1 }).exec()
            res.render("master/myOrders", { myOrders: myOrders })
        } catch (err) {
            console.log(err)
            res.redirect("/")
        }
    },

    orderDetails: async (req, res) => {
        try {
            const orderId = req.params.id
            const userId = req.user.id
            const myOrder = await Order.findById(orderId).populate([
                {
                    path: "userId",
                    model: "User"
                },
                {
                    path: "coupon",
                    model: "Coupon"
                },
                {
                    path: "products.productId",
                    model: "Product"
                }
            ]).exec()
            if (myOrder && myOrder.userId.id == userId) {
                res.render("master/orderDetails", {
                    myOrder: myOrder
                })
            } else {
                res.render("errorPage/error", { layout: false })
            }
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }

    }

}