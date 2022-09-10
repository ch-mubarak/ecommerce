const Order = require("../models/order")
const Product = require("../models/product")
const Cart = require("../models/cart")
const User = require("../models/users")

module.exports = {

    checkout: async (req, res) => {
        try {
            const userId = req.user.id
            const addressIndex = req.body.addressIndex
            const user = await User.findById(userId)
            if (!addressIndex) {
                user.address.unshift({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    house: req.body.house,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                    phone: req.body.phone
                })
                await user.save()
            }
            const cart = await Cart.findOne({ userId: userId })
            const paymentType = req.body.paymentType
            const deliveryAddress = addressIndex ? user.address[addressIndex] : user.address[0]

            await Order.create({
                userId: userId,
                deliveryAddress: deliveryAddress,
                products: cart.products,
                quantity: cart.quantity,
                subTotal: cart.subTotal,
                total: cart.total,
                paymentType: paymentType
            })
            await cart.remove()
            res.sendStatus(201)
            console.log("order success")
            // res.redirect("/user/myOrders")
        } catch (err) {
            console.log(err)
            return res.status(500)
            // res.redirect("/")

        }
    },
    packOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            const myOrder = await Order.findById(orderId)
            if (myOrder.status != "Cancelled") {
                myOrder.status = "Packed"
                await myOrder.save()
                return res.status(201).json({ message: "order Packed" })
            } else {
                return res.status(400).json({ message: "cant update status, Item is cancelled" })
            }

        } catch (err) {
            return res.status(500).json(err)
        }
    },


    shipOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            const myOrder = await Order.findById(orderId)
            if (myOrder.status != "Cancelled") {
                myOrder.status = "Shipped"
                await myOrder.save()
                return res.status(201).json({ message: "order shipped" })
            } else {
                return res.status(400).json({ message: "cant update status, Item is cancelled" })
            }

        } catch (err) {
            return res.status(500).json(err)
        }

    },

    outForDelivery: async (req, res) => {
        try {
            const orderId = req.params.id
            const myOrder = await Order.findById(orderId)
            if (myOrder.status != "Cancelled") {
                myOrder.status = "Out for delivery"
                await myOrder.save()
                return res.status(201).json({ message: "out for delivery" })
            } else {
                return res.status(400).json({ message: "cant update status, Item is cancelled" })
            }

        } catch (err) {
            return res.status(500).json(err)
        }

    },

    deliverPackage: async (req, res) => {
        try {
            const orderId = req.params.id
            const myOrder = await Order.findById(orderId)
            if (myOrder.status != "Cancelled") {
                myOrder.status = "Delivered"
                await myOrder.save()
                return res.status(201).json({ message: "order delivered" })
            } else {
                return res.status(400).json({ message: "cant update status, Item is cancelled" })
            }
        } catch (err) {
            return res.status(500).json(err)
        }

    },

    cancelOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            const myOrder = await Order.findById(orderId)

            if (myOrder.status != "Cancelled" && myOrder.status != "Delivered") {
                //updating stock for each items in order before cancelling 
                myOrder.products.forEach(async product => {
                    let myProduct = await Product.findById(product.productId)
                    myProduct.quantity += product.quantity
                    await myProduct.save()
                })
                myOrder.status = "Cancelled"
                await myOrder.save()
                return res.status(201).json({ message: "order cancelled and stock updated" })
            } else {
                return res.status(400).json({ message: "cant update status, Item already cancelled" })
            }

        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
}