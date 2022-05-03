const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        photo: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      address: { type: String, required: true },
      governate: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String },
      type: { type: String },
      orderNotes: { type: String },
    },
    phone: {
      type: String,
      required: [true, "Phone Number Should be Provided"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "bank"],
      // default: "cash",
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: [true, "order status is required"],
      enum: ["ordered", "onhold", "canceled", "refused", "completed"],
      default: "ordered",
    },
    isReviewed: {
      type: Boolean,
      required: [true, "order reviewed status is required"],
      default: false,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  // this.populate("user").populate({
  //   path: "tour",
  //   select: "name",
  // });

  this.populate({
    path: "user",
    select: "name email",
  });

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
