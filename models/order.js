const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryAddress: {
        type: Object
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true
    },
    quantity: {
        type: Number
    },
    total: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    paymentType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)