const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerImagePath: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    viewOrder: {
        type: Number,
        unique: true,
        required: true
    },
    caption: {
        type: String,
    },
    url: {
        type: String
    }
}, { timestamps: true })


module.exports = mongoose.model("Banner", bannerSchema)