const express = require("express")
const userControl = require("../controllers/userController")
const authentication = require("../middleware/authentication")
const wishlistControl = require("../controllers/wishlistController")
const cartControl = require("../controllers/cartController")
const shopControl = require("../controllers/shopController")
const orderControl =require("../controllers/orderController")
const paymentControl = require("../controllers/paymentController")
const router = express.Router()

router.use(authentication.checkLoggedIn, authentication.checkAccountVerified)

router.get("/home", userControl.getHome)
router.get("/changePassword", userControl.getChangePassword)
router.get("/wishlist", wishlistControl.wishlist)
router.get("/cart", cartControl.getCart)
router.get("/checkout", cartControl.getCheckout)
router.get("/myOrders", shopControl.myOrders)
router.get("/cartItemCount",cartControl.cartItemCount)
router.get("/wishlistItemCount",wishlistControl.wishlistItemCount)

router.post("/payment/orderId",paymentControl.generateOrder)
router.post("/payment/verify",paymentControl.verifyPayment)
router.post("/payment/:id/refund",paymentControl.refund)
router.post("/checkout", orderControl.checkout)

router.put("/cancelOrder/:id", orderControl.cancelOrder)
router.put("/wishlist/:id", wishlistControl.addToWishlist)
router.put("/addToCart/:id", cartControl.addToCart)
router.put("/changePassword", userControl.changePassword)

router.delete("/cart/:id", cartControl.deleteItem)
router.delete("/deleteAddress",userControl.removeAddress)

module.exports = router