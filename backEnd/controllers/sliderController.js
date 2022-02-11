const Slider = require("../models/sliderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/imgs/slider");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `slider-${Date.now()}.${ext}`);
//   },
// });

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

// const uploadSliderImage = upload.single("photo");
const uploadSliderImage = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "phonePhoto", maxCount: 1 },
]);

const resizeSliderImgae = catchAsync(async (req, res, next) => {
  if (!req.files.photo) return next();

  const mimetype_big = req.files.photo[0].mimetype.split("/")[1];
  //1)Add Desktop Photo
  req.body.photo = `slider-${Date.now()}.${mimetype_big}`;
  await sharp(req.files.photo[0].buffer).toFile(
    `uploads/imgs/slider/${req.body.photo}`
  );

  //2)Add Mobile Photo
  const mimetype_small = req.files.photo[0].mimetype.split("/")[1];
  req.body.phonePhoto = `slider-small-${Date.now()}.${mimetype_small}`;
  await sharp(req.files.phonePhoto[0].buffer).toFile(
    `uploads/imgs/slider/${req.body.phonePhoto}`
  );

  next();
});
/**
 * @desc  ADD NEW SLIDER ITEM
 * @route POST /api/sliders
 * @access Private ADMIN
 */
const addNewSliderItem = catchAsync(async (req, res, next) => {
  const { description, redirect, photo, phonePhoto, title } = req.body;
  if (!phonePhoto || !photo) {
    return next(new AppError("You should choose image first", 400));
  }

  const sliderItem = new Slider({
    photo,
    phonePhoto,
    description,
    redirect,
    title,
  });

  await sliderItem.save();

  res.status(201).json({ status: "done", sliderItem });
});

/**
 * @desc  EDIT SLIDER ITEM
 * @route PATCH /api/sliders/:id
 * @access Private ADMIN
 */
const editSliderItem = catchAsync(async (req, res, next) => {
  const { text, redirect, photo, phonePhoto, title } = req.body;
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(new AppError("Slider is not found", 404));
  }

  if (photo) slider.photo = photo;
  if (phonePhoto) slider.phonePhoto = phonePhoto;
  if (text) slider.text = text;
  if (redirect) slider.redirect = redirect;
  if (title) slider.title = title;

  await slider.save();

  res.status(201).json({ status: "done", slider });
});

/**
 * @desc  DELETE SLIDER ITEM
 * @route DELETE /api/sliders/:id
 * @access Private ADMIN
 */
const deleteSliderItem = catchAsync(async (req, res, next) => {
  const sliderItem = Slider.findById(req.params.id);
  if (!sliderItem) {
    return next(new AppError("Item is not found", 404));
  }

  await Slider.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: "Deleted" });
});

/**
 * @desc  GET ALL SLIDER ITEMS
 * @route GET /api/sliders
 * @access Public
 */
const getAllSliderItems = catchAsync(async (req, res, next) => {
  const sliders = await Slider.find();
  res.status(200).json({
    status: "success",
    sliders,
  });
});

/**
 * @desc  GET ONE SLIDER ITEMS
 * @route GET /api/sliders/:id
 * @access Public
 */
const getOneSlider = catchAsync(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);
  if (!slider) {
    return next(new AppError("Slider Not Found", 404));
  }
  res.status(200).json({
    status: "Success",
    slider,
  });
});

module.exports = {
  addNewSliderItem,
  deleteSliderItem,
  uploadSliderImage,
  editSliderItem,
  resizeSliderImgae,
  getAllSliderItems,
  getOneSlider,
};
