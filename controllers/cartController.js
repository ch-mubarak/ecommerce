const Cart = require("../models/cart");

module.exports = {

    addToCart: async (req, res) => {
        const { productId, name, } = req.body;
        const price = Number.parseFloat(req.body.price)
        const quantity = Number.parseInt(req.body.quantity)
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
                    productItem.subTotal = productItem.quantity * price
                    cart.products[itemIndex] = productItem;
                } else {
                    //product does not exists in cart, add new item
                    const subTotal = quantity * price
                    cart.products.push({ productId, quantity, name, price, subTotal });
                }
                cart.total = cart.products.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)
                await cart.save();
            } else {
                //no cart for user, create new cart
                const subTotal = quantity * price
                const total = subTotal
                await Cart.create({
                    userId,
                    products: [{ productId, quantity, name, price, subTotal }],
                    total: total
                });
            }
            res.redirect("/cart")
        } catch (err) {
            console.log(err);
            req.flash("message", "Error adding item to cart")
            res.redirect(`/product/${productId}`)

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
            res.locals.cartItemCount = (cart?.products) ? (cart.products.length)  : 0

        } catch (err) {
            console.log(err)
        }
    }
}