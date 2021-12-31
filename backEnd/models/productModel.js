const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const SubCategory = require("./subCategoryModel");
const Brand = require("./brandModel");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SpecificationSchema = new mongoose.Schema({
  price: {
    type: String,
    required: [true, "You Must provide a price"],
    min: [1, "invalid price value"],
  },
  size: {
    type: String,
    required: [true, "Size Must be Provided"],
  },
  color: {
    type: String,
    // required: [true, "Color Must be Provided"],
  },
  photo: {
    type: String,
    // required: [true, "you must provide a photo"],
  },
});

const ProductSchem = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
      // minLength: 15,
      //  maxlength: [40, 'A product name must have less or equal then 40 characters'],
      minlength: [
        10,
        "A Product name must have more or equal then 10 characters",
      ],
    },
    description: {
      type: String,
      required: [true, "Product description must be provided"],
      minLength: [
        30,
        "A description name must have more or equal then 30 characters",
      ],
    },
    shortDescription: {
      type: String,
      required: [true, "Product short description must be provided"],
      minLength: [
        30,
        "A description length must have more or equal then 30 characters",
      ],
    },
    // createdAt: {
    //     type: Date,
    //     default:Date.now()
    // },
    photo: {
      type: String,
      required: [true, "You Should specify product Main Photo"],
    },
    price: {
      type: Number,
      required: [true, "You Should specify product price"],
      min: [1, "invalid price value"],
    },
    size: {
      type: String,
      // required: [true, 'You Should specify product size']
    },
    color: {
      type: String,
      // required: [true, "You Should specify product color or shape"],
    },
    reviews: [reviewSchema],
    Specifications: [SpecificationSchema],
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      select: false,
    },
    countInStock: {
      type: Number,
      // required: [true, "Specify Number of pieces in stock"],
      default: 10,
    },
    //active === visibility (published/hidden)
    visibility: {
      type: String,
      default: "published",
      enum: ["published", "hidden"],
      required: [true, "You Should identify Visibility status of product"],
    },
    sku: {
      type: String,
      required: [true, "Sku is required"],
      unique: [true, "this SKU already exist"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "You Should specify category the product belongs to"],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [
        true,
        "You Should specify sub category the product belongs to",
      ],
    },
    commission: {
      type: Number,
      default: 0,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    // available: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

//Check that category is valid
/*
ProductSchem.pre( 'save', async function ( next ) {
    if ( !this.isModified( 'Category' ) || !this.isNew ) return next();

    const subCategory = await SubCategory.findById( this.subCategory );
    if ( !subCategory ) {
        return next( new AppError( 'Category is not valid try another one', 401 ) );
    }
    
    next();
} );
*/
ProductSchem.methods.checkValidCategory = async (SubCategoryId) => {
  const subCategory = await SubCategory.findById(SubCategoryId);

  if (!subCategory) {
    return false;
  }

  return true;
};

ProductSchem.methods.checkValidBrand = async (brandId) => {
  const brand = await Brand.findById(brandId);

  if (!brand) {
    return false;
  }

  return true;
};

//query middleware
ProductSchem.pre(/^find/, function (next) {
  this.populate({
    // path: "category subCategory brand",
    path: "category subCategory",
    select: "name",
  });

  next();
});

// ProductSchem.pre(/^find/, function (next) {
//   if (this.brand) {
//     this.populate({
//       path: "brand",
//       select: "name",
//     });
//   }

//   next();
// });

const Product = mongoose.model("Product", ProductSchem);

module.exports = Product;
