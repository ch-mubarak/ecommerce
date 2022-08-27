const express = require("express")
const router = express.Router()

const userControl = require("../controllers/userController")
const { upload } = require("../middleware/multer")
const authentication =require("../middleware/authentication")
const productControl = require("../controllers/productController")
const adminControl = require("../controllers/adminController")

const uploadImages = upload.array("productImages",5)

// router.use(authentication.checkLoggedIn, authentication.checkAdminPrivilege)

router.get("/", adminControl.home)

router.get("/users", adminControl.user)

router.get("/categories", adminControl.categories)

router.get("/products", adminControl.products)

router.put("/addCategory", adminControl.addCategory)

router.post("/addProduct", (req, res) => {
    uploadImages(req, res, (err) => {
        if (err) {
            console.log(err)
            req.flash("message", "Only image files supported, Max 4 Images")
            res.redirect("/admin/products")
        }
        else {
            productControl.addProduct(req, res)
        }
    })
})

router.put("/editProduct/:id", (req, res) => {
    uploadImages(req, res, (err) => {
        if (err) {
            req.flash("message", "Only image files supported, Max 4 Images")
            res.redirect("/admin/products")
        }
        else {
            productControl.editProduct(req, res)
        }
    })
})

router.put("/editCategory/:id", adminControl.editCategory)

router.put("/blockUser/:id", adminControl.blockUser)

router.put("/unblockUser/:id", adminControl.unblockUser)

router.delete("/deleteProduct/:id", productControl.deleteProduct)

router.delete("/deleteCategory/:id", adminControl.deleteCategory)

router.delete("/logout", userControl.userLogout)


module.exports = router