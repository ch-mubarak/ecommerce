const express = require("express")
const router = express.Router()
const Admin = require("../models/admin")
const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")

const { checkLoggedIn, userLogout } = require("../controllers/userController")

const {
    addCategory,
    addProduct,
    deleteProduct,
    deleteCategory,
    upload,
    blockUser,
    unblockUser,
    editCategory,
    editProduct,
    checkAdminPrivilege,

} = require("../controllers/adminController")

router.use(checkLoggedIn, checkAdminPrivilege)

router.get("/", (req, res) => {
    res.render("admin/dashboard")
})


router.get("/users", async (req, res) => {
    try {
        const errorMessage = req.flash("message")
        const users = await User.find({})
        res.render("admin/userManagement", { users: users, errorMessage: errorMessage })
    } catch (err) {
        console.log(err)
        res.redirect("/")

    }
})

router.get("/categories", async (req, res) => {
    try{
        const errorMessage = req.flash("message")
        const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
        res.render("admin/categoryManagement", { allCategories: allCategories, errorMessage: errorMessage })
    }catch(err){
        console.log(err)
    }
})

router.get("/products", async (req, res) => {
    try {
        const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
        const allProducts = await Product.find().populate("category").exec()
        res.render("admin/productManagement", { allProducts: allProducts, allCategories: allCategories })

    } catch (err) {
        console.log(err)
    }
})


router.put("/addCategory", addCategory)

router.post("/addProduct", upload.single("productImage"), addProduct)

router.put("/editProduct/:id", upload.single("productImage"), editProduct)

router.put("/editCategory/:id", editCategory)

router.put("/blockUser/:id", blockUser)

router.put("/unblockUser/:id", unblockUser)

router.delete("/deleteProduct/:id", deleteProduct)

router.delete("/deleteCategory/:id", deleteCategory)

router.delete("/logout",userLogout)


module.exports = router