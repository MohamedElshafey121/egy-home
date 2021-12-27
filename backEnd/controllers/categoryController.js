const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const APIFeatures = require("./../utils/apiFeatures");

/** 1) Uplaod Image */
/** 2) Resize an image */
exports.resizeImage = (modelName, folder) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.body.photo = `${modelName}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/imgs/${folder}/${req.body.photo}`);

    next();
  });

/*
 * @desc     CREATE NEW CATEGORY
 * @route    POST /categories
 * @access   Private
 */
// exports.createCategory = factory.createOne(Category);
exports.createCategory = catchAsync(async (req, res, next) => {
  console.log(req.body);
  //slug operations
  if (req.body.slug) {
    // if (req.body.slug.split(" ").length > 1) {
    //   return next(new AppError("category should not contains spaces", 400));
    // }
    req.body.slug = req.body.slug.trim().toLowerCase();
  }

  const category = await Category.create(req.body);

  if (!category) {
    return next(
      new AppError("Error while creating category, please try again later", 500)
    );
  }

  res.status(201).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

/*
 * @desc     GET ALL CATEGORIES
 * @route    GET /api/categories
 * @access   Public
 */
// exports.getAllCategory = factory.getAll(Category);
exports.getAllCategory = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;

  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const countdocs = new APIFeatures().countDocuments(Category, req.query);
  const count = await countdocs;
  const categories = await features.query;
  const page = req.query.page;

  res.status(200).json({
    status: "success",
    data: {
      categories,
      page,
      count,
      pages: Math.ceil(count / limit),
    },
  });
});
exports.updateCategory = factory.updateOne(Category);

/*
 * @desc     GET ALL CATEGORIES
 * @route    GET /api/categories/:id
 * @access   Public
 */
exports.getOneaCategory = factory.getOne(Category);

exports.createSubCategory = catchAsync(async (req, res, next) => {
  // const subCategory = await SubCategory.create( req.body );
  if (req.body.slug) {
    req.body.slug = req.body.slug.trim().toLowerCase();
  }

  const {
    name,
    category: Parentcategory,
    photo,
    slug,
    description,
    pageTitle,
    metaDescription,
  } = req.body;

  const subCategory = new SubCategory({
    name,
    category: Parentcategory,
    photo,
    slug,
    description,
    pageTitle,
    metaDescription,
  });

  //check if the category exist
  if (!(await subCategory.checkValidCategoryId(req.body.category))) {
    return next(new AppError("Category is not found", 401));
  }

  //add the new subcategory id to the parent category
  const category = await Category.findById(req.body.category);
  category.subCategories.push(subCategory._id);
  category.save();

  //save the new subcategory
  await subCategory.save({ validateBeforeSave: true });
  // console.log(subCategory)

  res.status(201).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});
exports.getAllCategorySubs = (req, res, next) => {
  req.query.category = req.params.catId || " ";
  next();
};
// exports.getAllSubCategory = factory.getAll(SubCategory);
exports.getAllSubCategory = catchAsync(async (req, res, next) => {
  let category;
  const limit = req.query.limit || 20;

  if (req.query.category) {
    category = await Category.findById(req.query.category);
    if (!category) {
      return res.status(404).json({
        status: "success",
        data: {
          subcategories: [],
          page,
          count,
          category: null,
        },
      });
    }
  }

  const features = new APIFeatures(SubCategory.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const countdocs = new APIFeatures().countDocuments(SubCategory, req.query);
  const count = await countdocs;
  const subcategories = await features.query;
  const page = req.query.page;
  console.log("count => ", count);

  res.status(200).json({
    status: "success",
    data: {
      subcategories,
      page,
      count,
      pages: Math.ceil(count / limit),
      category: category,
    },
  });
});
exports.updateSubCategory = factory.updateOne(SubCategory); //فيها شغل validation
exports.getOneSubCategory = factory.getOne(SubCategory);

/*
 * @desc     GET Top categories
 * @route    GET /categories/main
 * @access   public
 */
exports.getMainCategories = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 6;
  // console.log(req.query.limit);
  const categories = await Category.find().sort("-createdAt").limit(limit);

  if (!categories) {
    return next(new AppError("Top Products is not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});
