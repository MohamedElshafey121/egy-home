const mongoose = require("mongoose");
const sliderSchema = mongoose.Schema(
  {
    photo: {
      type: String,
      required: [true, "You should specify  photo"],
    },
    phonePhoto: {
      type: String,
      required: [true, "You should specify Phone  photo"],
    },
    title: String,
    description: String,
    redirect: {
      type: String,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.model("slider", sliderSchema);
module.exports = Slider;
