const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const Brand = require("../models/brandModel");
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

const getOneBrand = factory.getOne(Brand);
const updateBrand = factory.updateOne(Brand);

module.exports = {
  createNewBrand,
  getAllBrands,
  resizeImgae,
  getOneBrand,
  updateBrand,
};
