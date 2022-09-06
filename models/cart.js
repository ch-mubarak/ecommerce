const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
        name: String,
        price: Number,
        offerPrice: Number,
      }
    ],
    subTotal: {
      type: Number
    },
    total: {
      type: Number,
      default: 0,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);