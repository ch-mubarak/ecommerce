const Cart = require("../models/cart");
const User = require("../models/users")
const Order = require("../models/order")
const Product = require("../models/product")

module.exports = {
    addToCart: async (req, res) => {
        const productId = req.params.id
        const { name, price, quantity, offerPrice } = req.body;
        const userId = req.user.id
        try {

            const findProduct = await Product.findById(productId)
            if (findProduct.quantity >= quantity) {
                findProduct.quantity -= quantity

                let cart = await Cart.findOne({ userId });
                if (cart) {
                    //cart exists for user
                    let itemIndex = cart.products.findIndex(p => p.productId == productId);
                    if (itemIndex != -1) {
                        //product exists in the cart, update the quantity
                        let productItem = cart.products[itemIndex];
                        productItem.quantity += quantity
                        // cart.products[itemIndex] = productItem;
                    } else {
                        //product does not exists in cart, add new item
                        cart.products.push({ productId, quantity, name, price, offerPrice });
                    }
                    cart.subTotal = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity * curr.price;
                    }, 0)
                    cart.total = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity * (curr.offerPrice || curr.price);
                    }, 0)
                    await findProduct.save()
                    await cart.save();
                } else {
                    //no cart for user, create new cart
                    const subTotal = quantity * price
                    const total = quantity * offerPrice
                    await Cart.create({
                        userId,
                        products: [{ productId, quantity, name, price, offerPrice }],
                        subTotal: subTotal,
                        total: total
                    });
                    await findProduct.save()
                }
                res.status(201).json({ message: "added to cart" })
            }
            else {
                req.flash("message","this item is out of stock.")
                res.status(404).json({ message: "item not available" })
            }
        } catch (err) {
            res.status(500).json({ err })
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id
        try {
            const errorMessage =req.flash("message")
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })

            res.render("master/cart", {
                findCart: findCart,
                errorMessage:errorMessage
            })
        } catch (err) {
            console.log(err)
        }
    },
    cartItemCount: async (req, res, next) => {
        const userId = req.user.id
        try {
            const cart = await Cart.findOne({ userId })
            res.locals.cartItemCount = (cart?.products) ? (cart.products.length) : 0

        } catch (err) {
            console.log(err)
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
            const itemIndex = cart.products.findIndex(p => p.productId == productId);
            cart.products.splice(itemIndex, 1)
            cart.subTotal = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)
            cart.total = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * (curr.offerPrice || curr.price);
            }, 0)
            await cart.save()
            await findProduct.save()
            res.status(200).json({ message: "successfully deleted" })
        } catch (err) {
            res.status(400).json({ err })
        }
    },
    getCheckout: async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId, { email: 1 })
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })
            res.render("master/checkout", {
                findCart: findCart,
                email: user.email
            })
        } catch (err) {
            console.log(err)
        }
    },

    checkout: async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId)
            user.address = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                country: req.body.country,
                address: req.body.address1 + " " + req.body?.address2,
                city: req.body.phone,
                state: req.body.state,
                pincode: req.body.pincode,
                phone: req.body.phone
            }
            await user.save()
            const cart = await Cart.findOne({ userId: userId })
            await Order.create({
                userId: req.user.id,
                deliveryAddress: user.address,
                products: cart.products,
                total: cart.total
            })
            console.log("order success")
            await cart.remove()
            res.redirect("/")
        } catch (err) {
            console.log(err)

        }
    }
}