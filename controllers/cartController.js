const Cart = require("../models/cart");
const User = require("../models/users")
const Product = require("../models/product")
const states = ["Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry"]

module.exports = {
    addToCart: async (req, res) => {
        const productId = req.params.id
        const { name, price, quantity, offerPrice } = req.body;
        const userId = req.user.id
        try {

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
                        return acc + curr.quantity * curr.price;
                    }, 0)
                    cart.total = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity * (curr.offerPrice.toFixed || curr.price).toFixed(2);
                    }, 0)
                    await findProduct.save()
                    await cart.save();
                } else {
                    //no cart for user, create new cart
                    const subTotal = (quantity * price).toFixed(2)
                    const total = offerPrice ? (quantity * offerPrice).toFixed(2) : subTotal
                    cart = await Cart.create({
                        userId,
                        products: [{ productId, quantity, name, price, offerPrice }],
                        subTotal: subTotal,
                        total: total
                    });
                    await findProduct.save()
                    itemTotal = offerPrice ? offerPrice * quantity : price * quantity
                }
                return res.status(201).json({
                    message: "cart updated",
                    cartSubTotal: (cart.subTotal).toFixed(2),
                    cartDiscount: (cart.subTotal - cart.total).toFixed(2),
                    cartTotal: (cart.total).toFixed(2),
                    itemTotal: itemTotal.toFixed(2)
                })
            }
            else {
                return res.status(200).json({ message: "item not available" })
            }
        } catch (err) {
            return res.status(500).json({ err })
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id
        try {
            const errorMessage = req.flash("message")
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })

            res.render("master/cart", {
                findCart: findCart,
                errorMessage: errorMessage
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
            await cart.save()
            await findProduct.save()
            return res.status(200).json({
                message: "successfully deleted",
                cartSubTotal: (cart.subTotal).toFixed(2),
                cartDiscount: (cart.subTotal - cart.total).toFixed(2),
                cartTotal: (cart.total).toFixed(2)
            })
        } catch (err) {
            return res.status(400).json({ err })
        }
    },
    getCheckout: async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId, { email: 1, address: 1 })
            const findCart = await Cart.findOne({ userId: userId }).populate({
                path: "products.productId",
                model: "Product"
            })
            if (findCart?.products.length > 0) {
                res.render("master/checkout", {
                    findCart: findCart,
                    states:states,
                    user: user
                })
            } else {
                res.redirect("/user/cart")
            }
        } catch (err) {
            console.log(err)
        }
    },
}