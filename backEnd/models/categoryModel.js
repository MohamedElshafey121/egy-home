const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category should have a name"],
      unique: [true, "This Name is Not Valid"],
      minLength: [3, "name length should be more than 3 letters"],
    },

    photo: {
      type: String,
      required: [true, "Category Must have a photo"],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    slug: {
      type: String,
      // unique: [true, "slug name should be unique"],
      // required: [true, "slug is required"],
    },
    description: String,
    pageTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
      // required: [true, "seo description is required"],
      minLength: [20, "seo length should be at least 20 letter"],
    },
  },
  { timestamps: true }
);

//query middleware
categorySchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "subCategories",
    select: "name -category -_id",
  });

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
