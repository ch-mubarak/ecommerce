const express = require("express")
const router = express.Router()
const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")

const { checkLoggedIn, userLogout } = require("../controllers/userController")
const { upload } = require("../controllers/multerController")
const {
    addProduct,
    deleteProduct,
    editProduct
} = require("../controllers/productController")

const {
    addCategory,
    deleteCategory,
    blockUser,
    unblockUser,
    editCategory,
    checkAdminPrivilege,

} = require("../controllers/adminController")

router.use(checkLoggedIn, checkAdminPrivilege)

router.get("/", (req, res) => {
    res.render("admin/dashboard", { layout: "layouts/layouts" })
})


router.get("/users", async (req, res) => {
    try {
        const errorMessage = req.flash("message")
        const users = await User.find({}).sort({ createdAt: -1 }).exec()
        res.render("admin/userManagement", { users: users, errorMessage: errorMessage, layout: "layouts/layouts" })
    } catch (err) {
        console.log(err)
        res.redirect("/")

    }
})

router.get("/categories", async (req, res) => {
    try {
        const errorMessage = req.flash("message")
        const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
        res.render("admin/categoryManagement", { allCategories: allCategories, errorMessage: errorMessage, layout: "layouts/layouts" })
    } catch (err) {
        console.log(err)
    }
})

router.get("/products", async (req, res) => {
    try {
        const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
        const allProducts = await Product.find().populate("category").exec()
        const errorMessage = req.flash("message")
        res.render("admin/productManagement", { allProducts: allProducts, allCategories: allCategories, layout: "layouts/layouts", errorMessage: errorMessage })

    } catch (err) {
        console.log(err)
    }
})


router.put("/addCategory", addCategory)

router.post("/addProduct", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash("message", "File Not supported")
            res.redirect("/admin/products")
        }
        else {
            addProduct(req, res)
        }
    })
})

router.put("/editProduct/:id", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash("message", "File Not supported")
            res.redirect("/admin/products")
        }
        else {
            editProduct(req, res)
        }
    })
})

router.put("/editCategory/:id", editCategory)

router.put("/blockUser/:id", blockUser)

router.put("/unblockUser/:id", unblockUser)

router.delete("/deleteProduct/:id", deleteProduct)

router.delete("/deleteCategory/:id", deleteCategory)

router.delete("/logout", userLogout)


module.exports = router