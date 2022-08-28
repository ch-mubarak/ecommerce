const _ = require("lodash")
const Product = require("../models/product")
const Category = require("../models/category")

module.exports = {
    getHome: async (req, res) => {
        try {
            const allCategories = await Category.find()
            const allProducts = await Product.find().populate("category").sort({ createdAt: -1 }).limit(12).exec()
            res.render("master/index", {
                allCategories: allCategories,
                allProducts: allProducts
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const allCategories = await Category.find()
            const allProducts = await Product.find().populate("category").sort({ createdAt: -1 }).exec()
            res.render("master/shop", {
                allCategories: allCategories,
                allProducts: allProducts
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }

    },

    getShopByCategory: async (req, res) => {
        try {
            const allCategories = await Category.find()
            const paramsId = _.upperFirst(req.params.category)
            const findCategory = await Category.find({ categoryName: paramsId })
            const findProducts = await Product.find({ category: findCategory[0].id }).sort({ createdAt: -1 })
            res.render("master/category", {
                allCategories: allCategories,
                findProducts: findProducts,
                findCategory: findCategory,
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }

    },

    getProductById: async (req, res) => {
        try {
            const relatedProducts = await Product.find().limit(4).exec()
            const findProduct = await Product.findById(req.params.id).populate("category").exec()
            res.render("master/productDetails", {
                findProduct: findProduct,
                relatedProducts: relatedProducts
            })
        } catch (err) {
            console.log(err)
            res.render("errorPage/error", { layout: false })
        }
    }

}