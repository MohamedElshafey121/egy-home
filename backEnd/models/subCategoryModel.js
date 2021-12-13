const mongoose = require("mongoose");
const Category = require("./categoryModel");
const AppError = require("../utils/appError");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory should have a name"],
      unique: [true, "This Name is Not Valid"],
      minLength: [3, "name length should be more than 3 letters"],
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now()
    // },
    photo: {
      type: String,
      required: [true, "Category Must have a name"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Parent category should be provided"],
      ref: "Category",
    },
    slug: {
      type: String,
      unique: [true, "slug name should be unique"],
      required: [true, "slug is required"],
    },
    description: String,
    pageTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
      required: [true, "seo description is required"],
    },
  },
  {
    timestamps: true,
  }
);

/* 1) Document middleware(hooks) */

/* 2) query middleware */

/* 3) InstanceMethods */
subCategorySchema.methods.checkValidCategoryId = async function (catId) {
  const category = await Category.findById(catId);

  if (!category) return false;

  return true;
};

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });

  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
