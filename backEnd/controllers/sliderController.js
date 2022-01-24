const Slider = require("../models/sliderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/imgs/slider");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `slider-${Date.now()}.${ext}`);
  },
});

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

const uploadSliderImage = upload.single("photo");
/**
 * @desc  ADD NEW SLIDER ITEM
 * @route POST /api/sliders
 * @access Private ADMIN
 */
const addNewSliderItem = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("You should choose image ffirst", 404));
  }

  const { text, redirect } = req.body;
  const sliderItem = await Slider.create({
    photo: req.file.filename,
  });

  res.status(201).json({ status: "done", sliderItem });
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

module.exports = { addNewSliderItem, deleteSliderItem, uploadSliderImage };
