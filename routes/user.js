const express = require("express")
const userControl = require("../controllers/userController")
const authentication = require("../middleware/authentication")
const wishlistControl = require("../controllers/wishlistController")
const cartControl = require("../controllers/cartController")
const Order =require("../models/order")
const router = express.Router()

router.use(authentication.checkLoggedIn, authentication.checkAccountVerified)

router.get("/home", userControl.getHome)
router.get("/changePassword", userControl.getChangePassword)
router.get("/wishlist", wishlistControl.wishlist)
router.get("/cart", cartControl.getCart)
router.get("/checkout", cartControl.getCheckout)
router.get("/myorders",async(req,res)=>{
    try{
        const userId="63077b79c26f55806c688ede"
        const orders= await Order.find({userId})
        // console.log(order)
        res.render("master/myOrders",{orders:orders})
    }catch(err){
        console.log(err)
    }
})

router.post("/checkout", cartControl.checkout)

router.put("/wishlist/:id", wishlistControl.addToWishlist)
router.put("/addToCart/:id", cartControl.addToCart)
router.put("/changePassword", userControl.changePassword)

router.delete("/cart/:id", cartControl.deleteItem)

module.exports = router