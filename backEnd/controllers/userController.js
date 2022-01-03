const User = require("../models/userModel");
const Role = require("../models/RoleModel");
const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Factory = require("./handlerFactory");
const createSendToken = require("./../utils/createSendToken");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

/**
 * @desc  GET MY PROFILE
 * @route GET /users/profile
 * @access Private
 */
exports.getUserProfile = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

/**
 * @desc  GET USER BY ID
 * @route GET /users/:id
 * @access Private
 */
exports.getUser = Factory.getOne(User);

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new AppError("User Not found", 404));
  }

  console.log(req.body.oldPassword, user.password);
  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError("Password is not correct", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save({ validateBeforeSave: false });
  return createSendToken(user, 200, res);
});

/**
 * @desc  UPDATE USER PROFILE
 * @route PATCH /users/PROFILE
 * @access Private
 */
exports.updateUserProfile = catchAsync(async (req, res, next) => {
  // let filteredBody = {};
  // if ( req.body ) filteredBody = filterObj( req.body, 'name', 'email' );

  // const updatedUser = await User.findByIdAndUpdate( req.user._id, filteredBody, {
  //     runValidators: true,
  //     new: true
  // } );

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new AppError("User Not found", 404));
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  //   if (req.body.password) {
  //     console.log(req.body.oldPassword, user.password);
  //     if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
  //       return next(new AppError("Password is not correct", 400));
  //     }
  //     user.password = req.body.password;
  //     user.passwordConfirm = req.body.passwordConfirm;
  //     await user.save({ validateBeforeSave: false });
  //     return createSendToken(user, 200, res);
  //   }

  await user.save({ validateBeforeSave: false });
  user.password = undefined;
  user.passwordChangedAt = undefined;
  user.role = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * @desc   CREATE NEW USER ADDRESS
 * @route  PATCH /users/address
 * @access Private
 */
exports.addUserAddress = catchAsync(async (req, res, next) => {
  let filteredBody = {};
  const user = await User.findById(req.user._id);

  console.log(req.body);

  if (req.body)
    filteredBody = filterObj(
      req.body,
      "firstName",
      "lastName",
      "address",
      "governate",
      "city",
      "area",
      "type",
      "orderNotes",
      "phoneNumber",
      "email"
    );
  if (user.address.length === 0) filteredBody.default = true;

  // user.address.push(filteredBody);
  // await user.save({ validateBeforeSave: false });
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        address: { ...filteredBody },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!newUser) {
    return next(new AppError("Error while adding Address", 401));
  }

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * @desc   UPDATE USER ADDRESS
 * @route  PATCH /users/address/:id
 * @access Private
 */

exports.updateUserAddress = catchAsync(async (req, res, next) => {
  const address = req.user.address.id(req.params.id);
  let filteredBody = {};
  if (req.body)
    filteredBody = filterObj(
      req.body,
      "firstName",
      "lastName",
      "address",
      "governate",
      "city",
      "area",
      "type",
      "orderNotes",
      "phoneNumber",
      "email"
    );
  filteredBody.default = address.default;

  const user = await User.findOneAndUpdate(
    { _id: req.user._id, "address._id": req.params.id },
    {
      $set: {
        "address.$": filteredBody,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("Address is not found", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

/**
 * @desc   DELETE USER ADDRESS
 * @route  DELETE /users/address/:id
 * @access Private
 */
exports.deleteUSerAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const subDoc = user.address.id(req.params.id);
  if (!subDoc) {
    return next(new AppError("Address not found", 404));
  }

  if (subDoc.default) {
    return next(new AppError("can not delete default address"));
  }

  subDoc.remove();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  // const user = await User.findById( req.user._id );
  const address = req.user.address.id(req.params.id);

  if (!address) {
    return next(new AppError("Address Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      address,
    },
  });
});

/*
 * @desc     Change User Role
 * @route    PATCH /users/:userId/roles
 * @access   private admin
 */
//change User Role
exports.changeUserRole = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user._id === req.user._id) {
    return next(new AppError("You are not allowed to change your role", 403));
  }

  const role = await Role.findById(req.body.roleId);
  if (!role) {
    return next(new AppError("Role is not found", 404));
  }

  //Save changes
  user.role = role.name;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success",
  });
});

/*
 * @desc     Assign Category or change user category
 * @route    PATCH /users/:userId/categories
 * @access   private admin
 */
//change User Role
exports.assignCategoryToUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError("User is not found", 404));
  }

  if (user._id === req.user._id) {
    return next(new AppError("You are not allowed to change your role", 403));
  }
  // .populate( {
  //   path: "categories",
  //   select: "name",
  // });
  // parent.children.id(_id)
  // parent.children.push({ name: 'Liesl' })

  const category = await Category.findById(req.body.category).select("name");
  if (!category) {
    return next(new AppError("Category is not found", 404));
  }

  user.categories = category._id;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success",
  });
});
