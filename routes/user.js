const express = require("express")
const userControl = require("../controllers/userController")
const authentication = require("../middleware/authentication")
const wishlistControl = require("../controllers/wishlistController")
const cartControl = require("../controllers/cartController")
const shopControl = require("../controllers/shopController")
const router = express.Router()

router.use(authentication.checkLoggedIn, authentication.checkAccountVerified)

router.get("/home", userControl.getHome)
router.get("/changePassword", userControl.getChangePassword)
router.get("/wishlist", wishlistControl.wishlist)
router.get("/cart", cartControl.getCart)
router.get("/checkout", cartControl.getCheckout)
router.get("/myOrders", shopControl.myOrders)

router.post("/checkout", cartControl.checkout)

router.put("/cancelOrder/:id", shopControl.cancelOrder)
router.put("/wishlist/:id", wishlistControl.addToWishlist)
router.put("/addToCart/:id", cartControl.addToCart)
router.put("/changePassword", userControl.changePassword)

router.delete("/cart/:id", cartControl.deleteItem)

module.exports = router