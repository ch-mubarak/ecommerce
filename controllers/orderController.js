const Order = require("../models/order")
const Product = require("../models/product")

module.exports = {
    packOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            await Order.findByIdAndUpdate(orderId, {
                status: "Packed"
            })
            return res.status(201).json({ message: "order Packed" })

        } catch (err) {
            return res.status(500).json(err)
        }
    },


    shipOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            await Order.findByIdAndUpdate(orderId, {
                status: "Shipped"
            })
            return res.status(201).json({ message: "order shipped" })

        } catch (err) {
            return res.status(500).json(err)
        }

    },

    deliverPackage: async (req, res) => {
        try {
            const orderId = req.params.id
            await Order.findByIdAndUpdate(orderId, {
                status: "Delivered"
            })
            return res.status(201).json({ message: "order delivered" })

        } catch (err) {
            return res.status(500).json(err)
        }

    },

    cancelOrder: async (req, res) => {
        try {
            const orderId = req.params.id
            const order = await Order.findByIdAndUpdate(orderId, {
                status: "Cancelled"
            })
            order.products.forEach(async product => {
                let myProduct = await Product.findById(product.productId)
                myProduct.quantity += product.quantity
                await myProduct.save()
            })

            return res.status(201).json({ message: "order cancelled and stock updated" })

        } catch (err) {
            return res.status(500).json(err)
        }
    },
}