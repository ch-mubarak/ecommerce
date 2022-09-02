const express = require("express")
const router = express.Router()
const userControl = require("../controllers/userController")
const multer = require("../middleware/multer")
const authentication = require("../middleware/authentication")
const productControl = require("../controllers/productController")
const adminControl = require("../controllers/adminController")
const User = require("../models/users")

// router.use(authentication.checkLoggedIn, authentication.checkAdminPrivilege)

router.get("/", adminControl.home)
router.get("/users", adminControl.user)
router.get("/categories", adminControl.categories)
router.get("/products", adminControl.products)

router.post("/addCategory", adminControl.addCategory)
router.post("/addProduct", multer.send, productControl.addProduct)
router.put("/editProduct/:id", multer.send, productControl.editProduct)
router.put("/editCategory/:id", adminControl.editCategory)
router.put("/blockUser/:id", adminControl.blockUser)
router.put("/unblockUser/:id", adminControl.unblockUser)

router.delete("/deleteProduct/:id", productControl.deleteProduct)
router.delete("/deleteCategory/:id", adminControl.deleteCategory)
router.delete("/logout", userControl.userLogout)



router.get("/new",async(req,res)=>{
    try {
        const errorMessage = req.flash("message")
        const users = await User.find({}).sort({ createdAt: -1 }).exec()
        res.render("adminPanel/index", {
            users: users,
            errorMessage: errorMessage,
            layout: "layouts/adminLayout",
            extractScripts: true
        })
    } catch (err) {
        console.log(err.message)
        res.redirect("/")

    }
})


module.exports = router