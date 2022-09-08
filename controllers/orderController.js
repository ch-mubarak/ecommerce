const Order = require("../models/order")
const Product = require("../models/product")
const Cart = require("../models/cart")
const User = require("../models/users")
const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});

module.exports = {

    generateOrder: (req, res) => {
        const options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order1001"
        };
        instance.orders.create(options, function (err, order) {
            console.log(order);
            res.send({orderId:order.id})
        });
    },

    verifyPayment: async (req, res) => {
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

        const crypto = require("crypto");
        const expectedSignature = crypto.createHmac('sha256', '<YOUR_API_SECRET>')
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        let response = { "signatureIsValid": "false" }
        if (expectedSignature === req.body.response.razorpay_signature)
            response = { "signatureIsValid": "true" }
        res.send(response);

    },
    checkout: async (req, res) => {
        try {
            const userId = req.user.id
            const addressIndex = req.body.addressIndex
            const user = await User.findById(userId)
            if (req.body.newAddress == 'on') {
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
            const paymentType = req.body?.paypal == 'on' ? "Paypal" : "COD"
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
            console.log("order success")
            res.redirect("/user/myOrders")
            return res.status(201)
            // await cart.remove()
        } catch (err) {
            res.redirect("/")
            // return res.status(500)
            console.log(err)

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