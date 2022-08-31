const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "subCategory"
    },
    productImagePath: [String],
    price: {
        type: Number,
        required: true
    },
    discount: Number,
    offerPrice: Number,
    description: {
        type: String,
        required: true
    },
    brand: String,
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)