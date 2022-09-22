const mongoose = require("mongoose")
const Order = require("./order")

const reviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timeStamps: true })

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
    rating: {
        type: [Number]
    },
    reviews: [reviewSchema],
    avgRating: {
        type: Number,
        required: true,
        default: 0,
    },
    totalReviews: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true })


productSchema.pre("remove", function (next) {
    Order.find({ product: this.id }, (err, orders) => {
        if (err) {
            next(err)
        }
        else if (orders.length > 0) {
            next(new Error("This item cant be deleted."))
        }
        else {
            next()
        }
    })
})

module.exports = mongoose.model("Product", productSchema)