const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerImagePath: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    viewOrder: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    promoCoupon: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    url: {
        type: String
    }
}, { timestamps: true })


module.exports = mongoose.model("Banner", bannerSchema)