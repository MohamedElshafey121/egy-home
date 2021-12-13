const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const doc = await Model.findById( req.params.id );
    const doc = await Model.findOne({ _id: req.params.id });

    if (!doc) {
      return next(new AppError("No document Found found that ID", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    // const doc = await Model.find();
    const doc = await features.query;

    res.status(200).json({
      status: "Success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!doc) {
      return next(new AppError("No document Found with that ID", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        data: doc,
      },
    });
  });
