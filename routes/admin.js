const express = require("express")
const router = express.Router()

const userControl = require("../controllers/userController")
const { upload } = require("../middleware/multer")
const productControl = require("../controllers/productController")
const adminControl = require("../controllers/adminController")

const productUpload = upload.fields([{ name: "productImage", maxCount: 1 }, { name: "subImages", maxCount: 4 }])

// router.use(userControl.checkLoggedIn, adminControl.checkAdminPrivilege)

router.get("/", adminControl.home)

router.get("/users", adminControl.user)

router.get("/categories", adminControl.categories)

router.get("/products", adminControl.products)

router.put("/addCategory", adminControl.addCategory)

router.post("/addProduct", (req, res) => {
    productUpload(req, res, (err) => {
        if (err) {
            console.log(err)
            req.flash("message", "File Not supported or too many files")
            res.redirect("/admin/products")
        }
        else {
            productControl.addProduct(req, res)
        }
    })
})

router.put("/editProduct/:id", (req, res) => {
    productUpload(req, res, (err) => {
        if (err) {
            req.flash("message", "File Not supported")
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