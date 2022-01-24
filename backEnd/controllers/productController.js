//PACKAGES
const multer = require("multer");
const sharp = require("sharp");

//MODELS
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Cart = require("../models/cartModel");
const SubCategory = require("../models/subCategoryModel");

//CONTROLLERS
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

//MULTER CONFIGURATION
// const storage = multer.diskStorage( {
//     destination: ( req, file, cb ) => {
//         cb( null, 'uploads/imgs/products' )
//     },
//     filename: ( req, file, cb ) => {
//         const ext = file.mimetype.split( '/' )[1];
//         cb( null, `user-${ Date.now() }.${ ext }` );
//     }
// } );

/* Start Upload Product main image */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

//CONFIGURE MULTER UPLOAD
const upload = multer({
  storage,
  fileFilter,
});

exports.uploadProductImage = upload.fields([
  { name: "images", maxCount: 15 },
  { name: "photo", maxCount: 1 },
  { name: "extraPhotos", maxCount: 15 },
]);

// exports.resizeproductImage = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `product-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`uploads/imgs/products/${req.file.filename}`);

//   next();
// });

exports.resizeproductImages = catchAsync(async (req, res, next) => {
  // console.log("req.files first", req.files.images);
  if (!req.files.photo) return next();

  // 1) Cover image
  req.body.photo = `product-${Date.now()}.jpeg`;
  await sharp(req.files.photo[0].buffer)
    // .resize(700, 700)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/imgs/products/${req.body.photo}`);

  // 2) Images
  req.body.extraPhotos = [];

  if (req.files.extraPhotos) {
    // console.log("extraPhotos Found");
    await Promise.all(
      req.files.extraPhotos.map(async (file, i) => {
        const filename = `product-${Date.now()}-other${i + 1}.jpeg`;

        await sharp(file.buffer)
          // .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/imgs/products/${filename}`);

        req.body.extraPhotos.push(filename);
      })
    );
  }

  // 3) Images
  req.body.images = [];

  if (req.files.images) {
    // console.log("images Found");
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          // .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/imgs/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.resizenewProductImages = catchAsync(async (req, res, next) => {
  // 1) Cover image
  if (req.files.photo) {
    req.body.photo = `product-${Date.now()}.jpeg`;
    await sharp(req.files.photo[0].buffer)
      // .resize(700, 700)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/imgs/products/${req.body.photo}`);
  }

  // 2) Images

  if (req.files.extraPhotos) {
    req.body.extraPhotos = [];
    await Promise.all(
      req.files.extraPhotos.map(async (file, i) => {
        const filename = `product-${Date.now()}-other${i + 1}.jpeg`;

        await sharp(file.buffer)
          // .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/imgs/products/${filename}`);

        req.body.extraPhotos.push(filename);
      })
    );
  }

  next();
});

exports.uploadProductSpecImage = upload.single("photo");

exports.resizeProductSpecImgae = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `product-${req.params.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/imgs/products/${req.body.photo}`);

  next();
});

/* End Upload Product main image */

/*
 * @desc     Create New Product
 * @route    POST /api/products
 * @access   private
 */
exports.createProduct = catchAsync(async (req, res, next) => {
  const Specifications = JSON.parse(req.body.Specifications);
  if (req.body.images) {
    req.body.images.forEach((image, imageIdx) => {
      Specifications[imageIdx].photo = image;
    });
  }

  const {
    name,
    description,
    photo,
    shortDescription,
    price,
    oldPrice,
    size,
    color,
    shape,
    visibility,
    extraPhotos,
    sku,
    category,
    subCategory,
    brand,
  } = req.body;

  const categoryFound = await Category.findById(req.body.category);
  if (!categoryFound) {
    return next(new AppError("Category is not found", 404));
  }

  const subCategoryFound = await SubCategory.findById(req.body.subCategory);
  if (!subCategoryFound) {
    return next(new AppError(" Sub Category is not found ", 404));
  }

  // const newProduct = new Product(req.body);
  const newProduct = new Product({
    name,
    description,
    photo,
    extraPhotos,
    shortDescription,
    price,
    size,
    color,
    shape,
    Specifications,
    visibility,
    sku,
    oldPrice,
    category,
    subCategory,
    brand,
  });

  //check that the category ID is Valid
  if (!newProduct.checkValidCategory(req.body.category)) {
    return next(
      new AppError(
        "Category is not valid try again or specify another one ",
        401
      )
    );
  }

  if (req.body.brand) {
    if (!newProduct.checkValidBrand(req.body.category)) {
      return next(
        new AppError(
          "Brand is not valid try again or specify another one ",
          401
        )
      );
    }
  }
  await newProduct.save();

  res.status(201).json({
    status: "Success",
    data: { product: newProduct },
  });
});

/*
 * @desc     Add Product Image
 * @route    PATCH /api/products/:id
 * @access   private
 */
// exports.addImgae = catchAsync( async ( req, res, next ) => {
//     if ( req.file ) req.body.photo = req.file.filename;

//     const product = await Product.findById( req.params.id );
//     if ( !product ) {
//         return next( new AppError( 'Product not found', 404 ) );
//     }
//     product.photo = req.body.photo;
//     await product.save( { validateBeforeSave: false } );
//     res.status( 201 ).json( {
//         status: success,
//         data: {
//             product
//         }
//     })

// })

/*
 * @desc     Fetch Products By Category
 * @route    GET /api/products/category/:id
 * @access   public
 */
exports.getProductByCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category is not found", 404));
  }
  req.category = category;
  req.query.category = req.params.id;
  next();
});

/*
 * @desc     Fetch All Products
 * @route    GET /api/products
 * @access   public
 */
exports.getAllProducts = catchAsync(async (req, res, next) => {
  let category;
  const limit = req.query.limit || 20;

  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const countdocs = new APIFeatures().countDocuments(Product, req.query);
  const count = await countdocs;
  const products = await features.query;
  const page = req.query.page;

  if (req.query.category) {
    console.log("req.query.category: ", req.query.category);
    category = await Category.findById(req.query.category);
    if (!category) {
      return res.status(404).json({
        status: "success",
        data: {
          products: [],
          page,
          count,
          category: null,
        },
      });
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      products,
      page,
      count,
      pages: Math.ceil(count / limit),
      category: category,
    },
  });
});

/*
 * @desc     Fetch One Product
 * @route    GET /api/products/:id
 * @access   public
 */
exports.GetProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product is not found ", 400));
  }

  res.status(200).json({
    status: "Success",
    product,
  });
});

/*
 * @desc     Update One Product
 * @route    PATCH /api/products/:id
 * @access   Private
 */
exports.updateProduct = catchAsync(async (req, res, next) => {
  if (req.file) req.body.photo = req.file.filename;
  if (req.body.extraPhotos) console.log(req.body.extraPhotos);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("Product is not found ", 400));
  }
  res.status(200).json({
    status: "Success",
    data: {
      product: product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("No Product With that id Found", 404));
  }

  res.status(204).json({
    status: "Successs",
    messge: "Product Deleted",
  });
});

/*
 * @desc     GET RELATED PRODUCTS
 * @route    GET /api /products/:id/related
 * @access   public
 */
exports.getRelatedProducts = catchAsync(async (req, res, next) => {
  let relatedProducts;
  const product = await Product.findById(req.params.id).select(
    "subCategory category"
  );

  if (!product) {
    return next(new AppError("Product is not found", 404));
  }

  relatedProducts = await Product.find({
    subCategory: product.subCategory,
    _id: { $ne: req.params.id },
  }).limit(10);

  if (!relatedProducts) {
    relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: req.params.id },
    }).limit(10);
  }

  res.status(200).json({
    status: "success",
    data: {
      products: relatedProducts,
    },
  });
});

/*
 * @desc     Add Product Specification
 * @route    POST/api /products
 * @access   private
 */
exports.addProductSpecification = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(req.body);

  if (!product) {
    return next(new AppError("Product is not found ", 400));
  }

  const specification = {
    price: req.body.price,
    size: req.body.size,
    color: req.body.color,
    photo: req.body.photo,
    shape: req.body.shape,
  };

  product.Specifications.push(specification);

  await product.save();
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

/*
 * @desc     GET (ONE) Product  Specification
 * @route    GET /api/products/:id/specifications/:specId
 * @access   private
 */
exports.getProductOneSpecifcation = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const spec = await product.Specifications.id(req.params.specId);

  if (!spec) {
    return next(new AppError("Specification Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      specification: spec,
    },
  });
});

/*
 * @desc     Remove (ONE) Product  Specification
 * @route    DELETE /api/products/:id/specifications/:specId
 * @access   Private
 */
exports.removeProductSpecification = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product Not Found", 400));
  }

  await product.Specifications.id(req.params.specId).remove();
  await product.save();

  res.status(200).json({
    status: "Success",
    message: "Specification Deleted",
  });
});

/*
 * @desc     UPDATE Product Specification
 * @route    PATCH /api/products/:id/specifications/:specId
 * @access   private
 */
exports.updateProductSpecification = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product is Not Found", 404));
  }

  const spec = await product.Specifications.id(req.params.specId);
  if (!spec) {
    return next(new AppError("Spec is not found", 404));
  }

  const specification = {
    price: req.body.price || spec.price,
    size: req.body.size || spec.size,
    color: req.body.color || spec.color,
    photo: req.body.photo || spec.photo,
    shape: req.body.shape || spec.shape,
  };

  const newProduct = await Product.findOneAndUpdate(
    {
      _id: req.params.id,
      "Specifications._id": req.params.specId,
    },
    {
      $set: {
        "Specifications.$": specification,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "Success",
    data: {
      product: newProduct,
    },
  });
});

/*
 * @desc     Get Top Rated Products
 * @route    GET /api/products/top/:catId?
 * @access   private
 */
exports.getTopProducts = catchAsync(async (req, res, next) => {
  if (req.params.catId) {
    req.query.category = req.params.catId;
  }
  req.query.sort = "-rating";
  req.query.limit = 10;
  // const products = await Product.find().sort("-rating").limit(7);
  // if (!products) {
  //   return next(new AppError("top products not found", 404));
  // }
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     products,
  //   },
  // });
  next();
});

/*
 * @desc     Get Top Products
 * @route    GET /api/products/recent/:catId?
 * @access   private
 */
exports.getRecentProducts = catchAsync(async (req, res, next) => {
  req.query.limit = req.query.limit || 12;
  if (req.params.catId) {
    req.query.category = req.params.catId;
  }
  req.query.sort = "-createdAt";
  next();
  // const products = await Product.find().sort( '-createdAt' ).limit( 10 );
  // if ( !products ) {
  //     return next( new AppError( 'top products not found', 404 ) );
  // }
  // res.status( 200 ).json( {
  //     status: 'success',
  //     data: {
  //         products
  //     }
  // })
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  console.log(typeof Number(rating));

  const product = await Product.findById(req.params.id);
  // console.log("product", product);

  if (!product) {
    return next(new AppError("product is not found", 404));
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return next(new AppError("Product already reviewed", 400));
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  // await Product.findByIdAndUpdate(req.params.id, {
  //   $push: {
  //     reviews: review,
  //   },
  //   numReviews: product.reviews.length,
  //   rating:
  //     product.reviews.reduce((acc, item) => item.rating + acc, 0) /
  //     product.reviews.length,
  // });

  res.status(201).json({ success: true, message: "Review added" });
});
