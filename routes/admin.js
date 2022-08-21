const express = require("express")
const router = express.Router()
const Admin = require("../models/admin")
const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")

const {checkLoggedIn}=require("../controllers/userController")

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


router.get("/",checkLoggedIn,checkAdminPrivilege, (req, res) => {
    res.render("admin/dashboard")
})


router.get("/users",checkLoggedIn,checkAdminPrivilege, async (req, res) => {
    try {
        const errorMessage=req.flash("message")
        const users = await User.find({})
        res.render("admin/userManagement", { users: users,errorMessage:errorMessage })
    } catch (err) {
        console.log(err)
        res.redirect("/")

    }
})

router.get("/categories",checkLoggedIn,checkAdminPrivilege, async (req, res) => {
    const errorMessage = req.flash("message")
    const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
    res.render("admin/categoryManagement", { allCategories: allCategories, errorMessage: errorMessage })
})

router.get("/products",checkLoggedIn,checkAdminPrivilege, async (req, res) => {
    try {
        const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
        const allProducts = await Product.find().populate("category").exec()
        res.render("admin/productManagement", { allProducts: allProducts, allCategories: allCategories })

    } catch (err) {
        console.log(err)
    }
})


router.put("/addCategory",checkLoggedIn,checkAdminPrivilege,addCategory)

router.post("/addProduct",checkLoggedIn,checkAdminPrivilege, upload.single("productImage"), addProduct)

router.put("/editProduct/:id",checkLoggedIn,checkAdminPrivilege,upload.single("productImage"),editProduct)

router.put("/editCategory/:id",checkLoggedIn,checkAdminPrivilege,editCategory)

router.put("/blockUser/:id",checkLoggedIn,checkAdminPrivilege,blockUser)

router.put("/unblockUser/:id",checkLoggedIn,checkAdminPrivilege,unblockUser)

router.delete("/deleteProduct/:id",checkLoggedIn,checkAdminPrivilege, deleteProduct)

router.delete("/deleteCategory/:id",checkLoggedIn,checkAdminPrivilege, deleteCategory)



module.exports = router