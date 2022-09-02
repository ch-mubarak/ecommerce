const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    myList: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required:true
            },
            name: {
                type: String,
                required:true
            },
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("Wishlist", wishlistSchema)