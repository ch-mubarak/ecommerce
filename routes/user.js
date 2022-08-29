const express = require("express")
const userControl = require("../controllers/userController")
const authentication = require("../middleware/authentication")
const wishlistControl = require("../controllers/wishlistController")
const cartControl = require("../controllers/cartController")
const router = express.Router()

router.use(authentication.checkLoggedIn, authentication.checkAccountVerified)

router.get("/home", userControl.getHome)
router.get("/changePassword", userControl.getChangePassword)
router.get("/wishlist", wishlistControl.wishlist)
router.put("/wishlist", wishlistControl.addToWishlist)
router.get("/cart", cartControl.getCart)
router.put("/addToCart", cartControl.addToCart)
router.delete("/cart", cartControl.deleteItem)
router.put("/changePassword", userControl.changePassword)


module.exports = router