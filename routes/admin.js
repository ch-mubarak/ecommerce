const express = require("express")
const router = express.Router()
const userControl = require("../controllers/userController")
const multer = require("../middleware/multer")
const authentication = require("../middleware/authentication")
const productControl = require("../controllers/productController")
const adminControl = require("../controllers/adminController")

// router.use(authentication.checkLoggedIn, authentication.checkAdminPrivilege)

router.get("/", adminControl.home)
router.get("/categories", adminControl.categories)
router.get("/products", adminControl.products)
router.get("/orders", adminControl.orders)

router.post("/addCategory", adminControl.addCategory)
router.post("/addProduct", multer.send, productControl.addProduct)
router.put("/editProduct/:id", multer.send, productControl.editProduct)
router.put("/editCategory/:id", adminControl.editCategory)
router.put("/blockUser/:id", adminControl.blockUser)
router.put("/unblockUser/:id", adminControl.unblockUser)

router.delete("/deleteProduct/:id", productControl.deleteProduct)
router.delete("/deleteCategory/:id", adminControl.deleteCategory)
router.delete("/logout", userControl.userLogout)


module.exports = router