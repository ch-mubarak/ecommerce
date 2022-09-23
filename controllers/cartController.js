const Cart = require("../models/cart");
const User = require("../models/users")
const Product = require("../models/product")

module.exports = {
    addToCart: async (req, res) => {
        const productId = req.params.id
        const { name, price, quantity, offerPrice } = req.body;
        const userId = req.user.id
        try {

            //updating stock
            const findProduct = await Product.findById(productId)
            if (findProduct.quantity >= quantity) {
                findProduct.quantity -= quantity

                let itemTotal
                let cart = await Cart.findOne({ userId });
                if (cart) {
                    //cart exists for user
                    let itemIndex = cart.products.findIndex(product => product.productId == productId);
                    if (itemIndex != -1) {
                        //product exists in the cart, update the quantity
                        let productItem = cart.products[itemIndex];
                        productItem.quantity += quantity
                        // cart.products[itemIndex] = productItem;
                        itemTotal = offerPrice ? offerPrice * productItem.quantity : price * productItem.quantity
                    } else {
                        //product does not exists in cart, add new item
                        cart.products.push({ productId, quantity, name, price, offerPrice });
                        itemTotal = offerPrice ? offerPrice * quantity : price * quantity
                    }
                    cart.subTotal = cart.products.reduce((acc, curr) => {
                        return acc + (curr.quantity * curr.price);
                    }, 0)
                    cart.total = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity * (curr.offerPrice || curr.price);
                    }, 0)

                    await findProduct.save()
                    await cart.save();
                } else {
                    //no cart for user, create new cart
                    const subTotal = (quantity * price)
                    const total = offerPrice ? (quantity * offerPrice) : subTotal
                    cart = await Cart.create({
                        userId,
                        products: [{ productId, quantity, name, price, offerPrice }],
                        subTotal: subTotal,
                        total: total
                    });
                    await findProduct.save()
                    itemTotal = offerPrice ? offerPrice * quantity : price * quantity
                }
                //removing coupon from session if exist
                req.session.coupon = null
                return res.status(201).json({
                    message: "cart updated",
                    itemTotal: itemTotal.toFixed(2)
                })
            }
            else {
                return res.status(200).json({ message: "item not available" })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ err })
        }
    },

    getCart: async (req, res) => {
        const allCategories = await Category.find();
        const userId = req.user.id
        try {
            const errorMessage = req.flash("message")
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })
            const couponCode = req.session.coupon?.code
            const couponDiscount = Number(req.session.coupon?.discount)
            res.render("master/cart", {
                allCategories:allCategories,
                findCart: findCart,
                errorMessage: errorMessage,
                couponCode: couponCode,
                couponDiscount: couponDiscount

            })
        } catch (err) {
            console.log(err)
        }
    },
    cartItemCount: async (req, res, next) => {
        const userId = req.user.id
        try {
            let itemCount = 0
            const cart = await Cart.findOne({ userId })
            if (cart) {
                cart.products.forEach(product => {
                    itemCount += product.quantity
                })
            }
            res.locals.cartItemCount = itemCount
            return res.status(200).json({ itemCount: itemCount })

        } catch (err) {
            console.log(err)
            return res.status(500).json({ err })
        }
    },
    deleteItem: async (req, res, next) => {
        const userId = req.user.id
        const productId = req.params.id
        const cartCount = req.body.cartCount
        try {
            const findProduct = await Product.findById(productId)
            findProduct.quantity += cartCount
            const cart = await Cart.findOne({ userId })
            const itemIndex = cart.products.findIndex(product => product.productId == productId);
            cart.products.splice(itemIndex, 1)
            cart.subTotal = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)
            cart.total = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * (curr.offerPrice || curr.price);
            }, 0)
            //removing coupon from session if exist
            req.session.coupon = null
            await cart.save()
            await findProduct.save()
            return res.status(200).json({
                message: "successfully deleted",
            })
        } catch (err) {
            return res.status(400).json({ err })
        }
    },
    getCheckout: async (req, res) => {
        try {
            const userId = req.user.id
            const allCategories = await Category.find();
            //getting coupon from session
            const couponDiscount = req.session.coupon?.discount
            const couponCode = req.session.coupon?.code
            const user = await User.findById(userId, { email: 1, address: 1 })
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })
            if (findCart?.products.length > 0) {
                res.render("master/checkout", {
                    allCategories:allCategories,
                    findCart: findCart,
                    user: user,
                    couponCode: couponCode,
                    couponDiscount: couponDiscount
                })
            } else {
                res.redirect("/user/cart")
            }
        } catch (err) {
            console.log(err)
        }
    },
}