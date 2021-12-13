//MODELS
const Permission = require("../models/PermissionModel");
const Role = require("../models/RoleModel");

//CONTROLLERS
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

/**
 * @desc     Create New Permission
 * @route    POST /api/permissions
 * @access   private admin
 */
const createPermission = catchAsync(async (req, res, next) => {
  const { name, description, name_ar } = req.body;

  const permission = new Permission({ name, description, name_ar });
  if (!permission) {
    return next(new AppError("Error creating Permission", 404));
  }

  await permission.save();

  res.status(201).json({
    status: "success",
    data: {
      permission,
    },
  });

  // const role = await Role.findById( roleId );
  // if ( !role ) {
  //     return next( new AppError( 'Role is not found', 404 ) );
  // }

  //create new role;

  //add permission to role
  // const updatePermission = await Role.findByIdAndUpdate( permission.role, {
  //     $push: {
  //         permissions: permission._id
  //     }
  // }, { runValidators: true, new: true } );

  // if ( !updatePermission ) {
  //     return next(new AppError('error while adding permission to role',400))
  // }
});

/*
 * @desc     Get All Permissions
 * @route    GET /api/permissions
 * @access   private admin
 */
const getAllPermissions = catchAsync(async (req, res, next) => {
  const permissionsQuery = new APIFeatures(Permission.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const permissions = await permissionsQuery.query;
  // const permissions = await Permission.find();
  res.status(200).json({
    status: "success",
    data: {
      permissions,
    },
  });
});

module.exports = {
  createPermission,
  getAllPermissions,
};
