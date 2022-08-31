const Cart = require("../models/cart");

module.exports = {
    addToCart: async (req, res) => {
        const productId = req.params.id
        const { name, price, quantity, offerPrice } = req.body;
        const userId = req.user.id
        try {
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
                    return acc + curr.quantity * (curr.offerPrice||curr.price) ;
                }, 0)
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
            }
            // res.redirect("/user/cart")
            res.status(201).json({ message: "added to cart" })
        } catch (err) {
            res.status(500).json({ err })
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id
        try {
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })

            res.render("master/cart", {
                findCart: findCart
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
        try {
            const cart = await Cart.findOne({ userId })
            const itemIndex = cart.products.findIndex(p => p.productId == productId);
            cart.products.splice(itemIndex, 1)
            cart.subTotal = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)
            cart.total = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * (curr.offerPrice||curr.price) ;
            }, 0)
            await cart.save()
            // res.redirect("/user/cart")
            res.status(200).json({ message: "successfully deleted" })
        } catch (err) {
            res.status(400).json({ err })
        }
    }
}