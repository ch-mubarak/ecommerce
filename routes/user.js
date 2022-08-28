const express = require("express")
const userControl = require("../controllers/userController")
const authentication = require("../middleware/authentication")
const wishlistControl = require("../controllers/wishlistController")
const router = express.Router()

router.use(authentication.checkLoggedIn)

router.get("/home", authentication.checkAccountVerified, userControl.getHome)
router.get("/changePassword", authentication.checkAccountVerified, userControl.getChangePassword)
router.get("/wishlist", wishlistControl.wishlist)
router.put("/wishlist", wishlistControl.addToWishlist)
router.put("/changePassword", userControl.changePassword)


module.exports = router