const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand Name is required"],
      unique: [true, "this brand  is exist"],
      minLength: [2, "brand name should be more than 2 letters"],
    },
    photo: {
      type: String,
      required: [true, "brand photo is required"],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
