const mongoose = require("mongoose");

const cartItems = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    required: [true, "product is required for cart items"],
    ref: "Product",
  },
  name: {
    type: String,
    required: [true, "product name is required"],
  },
  photo: {
    type: String,
    required: [true, "product photo is required"],
  },
  price: {
    type: Number,
    required: [true, "product price is required"],
  },
  qty: {
    type: Number,
    required: [true, "product quantity is required"],
  },
  // shape: {
  //   type: String,
  // },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "User is requires"],
      ref: "User",
    },
    cartItems: [cartItems],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
