const mongoose = require("mongoose");
const sliderSchema = mongoose.Schema({
  photo: {
    type: String,
    required: [true, "You should specify  photo"],
  },
  text: String,
  redirect: {
    type: String,
    enum: ["shop", "offers", "new"],
    default: "shop",
  },
});

const Slider = mongoose.model("model", sliderSchema);
module.exports = Slider;
