const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");
const sharp = require("sharp");

const resizeImgae = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `brand-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/imgs/brands/${req.file.filename}`);

  next();
});
/**
 * @desc  CRATE NEW BRAND
 * @route POST /api/brands
 * @access private
 */
const createNewBrand = catchAsync(async (req, res, next) => {
  if (req.file) req.body.photo = req.file.filename;
  const { name, description, photo } = req.body;

  const brand = new Brand({ name, description, photo });
  await brand.save();

  res.status(201).json({
    status: "success",
    data: {
      brand,
    },
  });
});

/**
 * @desc  GET ALL BRANDS
 * @route GET /api/brands
 * @access public
 */
const getAllBrands = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;

  const brandsQuery = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const countdocs = new APIFeatures().countDocuments(Brand, req.query);
  const count = await countdocs;
  const brands = await brandsQuery.query;
  const page = req.query.page;

  res.status(200).json({
    status: "success",
    data: {
      brands,
      page,
      count,
      pages: Math.ceil(count / limit),
    },
  });
});

/**
 * @desc  GET ONE BRAND
 * @route GET /api/brands/:id
 * @access public
 */
const getOneBrand = factory.getOne(Brand);
/**
 * @desc  UPDATE ONE BRAND
 * @route PATCH /api/brands/:id
 * @access public
 */
const updateBrand = factory.updateOne(Brand);

/**
 * @desc  DELETE ONE BRAND
 * @route DELETE /api/brands/:id
 * @access public
 */
const deleteBrand = catchAsync(async (req, res, next) => {
  // 1)check if brand exist
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new AppError("Brand not exist", 404));
  }

  // 2)get all products belong to this brand and set brand (undefined)[remove brand]
  const products = await Product.find({ brand: brand._id });
  if (products.length) {
    products.forEach(async (product) => {
      product.brand = undefined;
      await product.save();
    });
  }

  // 3)delete Brand
  await Brand.deleteOne({ _id: brand._id });
  res.status(204).json({
    status: "deleted",
  });
});

module.exports = {
  createNewBrand,
  getAllBrands,
  resizeImgae,
  getOneBrand,
  updateBrand,
  deleteBrand,
};
