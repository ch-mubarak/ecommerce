const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    couponCode: {
        type: String,
        require: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    discount: {
        type: Number,
        require: true
    },
    maxLimit: {
        type: Number,
        require: true
    },
    minPurchase: {
        type: Number,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Coupon", couponSchema)