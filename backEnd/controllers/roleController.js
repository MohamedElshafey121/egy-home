//MODELS
const Role = require("../models/RoleModel");
const Permission = require("../models/PermissionModel");

//CONTROLLERS
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

//For ACL
const getSiteRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.find().populate("permissions");
  return roles;
});

// const roles = getSiteRoles();

const getRolesWithPermissions = catchAsync(async (req, res, next) => {
  const userRole = "admin";
  const permissionName = "getusersList";
  // 1)GET ALL ROLES
  // const roles = await Role.find().populate( 'permissions' );

  //2)GET USER ROLE
  const role = roles.find((r) => r.name === userRole); //get role by name
  // const role = roles.find( r => r._id === userRole ); //get role by id

  // 3)CHECK FOR PERMISSIO
  const found = role.permissions.find((perm) => perm.name === permissionName); //get permission by name
  if (found) console.log("Found => ", found);

  if (!found) {
    return next(
      new AppError("You arenot allowed to access this resource", 404)
    );
  }

  next();
});

const ACLMiddleware = (permission) => {
  return async (req, res, next) => {
    const userRole = req.user.role;
    // console.log("userRole => ", userRole);

    if (userRole.toLowerCase().trim() === "admin") return next();
    // const permissionName = "getusersList"
    // 1)GET ALL ROLES
    const roles = await Role.find().populate("permissions");

    //2)GET USER ROLE
    const role = roles.find((r) => r.name === userRole); //get role by name
    // const role = roles.find( r => r._id === userRole ); //get role by id

    // 3)CHECK FOR PERMISSIO
    const found = role.permissions.find(
      (perm) =>
        perm.name.toLowerCase().trim() === permission.toLowerCase().trim()
    ); //get permission by name
    if (found) console.log("Found => ", found);

    if (!found) {
      return next(
        new AppError("You arenot allowed to access this resource", 403)
      );
    }

    next();
  };
};

/*
 * @desc     Create New Role
 * @route    POST /api/roles
 * @access   private admin
 */
const createRole = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, description, permissions } = req.body;

  const role = new Role({ name, description });
  if (role && permissions.length) {
    permissions.forEach((permission) => role.permissions.push(permission));
  }
  await role.save();

  if (!role) {
    return next(
      new AppError("Error while Creating Role, Please try again", 400)
    );
  }

  res.status(201).json({
    status: "success",
    data: {
      role,
    },
  });
});

/*
 * @desc     Get All Roles
 * @route    GET /api/roles
 * @access   private admin
 */
const getAllroles = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;

  const rolesQuery = new APIFeatures(Role.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const countdocs = new APIFeatures().countDocuments(Role, req.query);
  const count = await countdocs;
  const roles = await rolesQuery.query;
  const page = req.query.page;

  res.status(200).json({
    status: "success",
    data: {
      roles,
      page,
      count,
      pages: Math.ceil(count / limit),
    },
  });
});

/*
 * @desc     Add Permission To Role & Update role description
 * @route    PATCH /api/roles/:id
 * @access   private admin
 */
const addRolePermission = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  console.log(req.body);
  //check if permission exist in DB
  const permission = await Permission.findById(req.body.permissionId);
  if (!permission) {
    return next(new AppError("permission not found", 404));
  }

  //check if permission already belongs to role
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new AppError("Role not found", 404));
  }

  const existPermission = role.permissions.includes(permission._id);
  if (existPermission) {
    return next(new AppError("permission already exist", 404));
  }

  //update  Role Description decription
  if (description) {
    role.description = description;
    await role.save();
  }

  //update the role
  const newRole = await Role.findByIdAndUpdate(
    req.params.id,
    {
      $push: { permissions: permission._id },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      role: newRole,
    },
  });
});

/*
 * @desc      Update role description
 * @route    PATCH /api/roles/description/:id
 * @access   private admin
 */
const updateRoleDescription = catchAsync(async (req, res, next) => {
  const { description } = req.body;

  //check if permission already belongs to role
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new AppError("Role not found", 404));
  }

  //update  Role Description decription
  if (!description) {
    return next(new AppError("Provide a description", 400));
  }

  role.description = description;
  await role.save();

  res.status(200).json({
    status: "success",
  });
});

/*
 * @desc     Remove Permission From Role
 * @route    DELETE /api/:roleId/permissions/:permissionId
 * @access   private admin
 */
const removeRolePermission = catchAsync(async (req, res, next) => {
  //check if permission exist in DB
  const permission = await Permission.findById(req.params.permissionId);
  if (!permission) {
    return next(new AppError("permission not found", 404));
  }

  //check if permission already belongs to role
  const role = await Role.findById(req.params.roleId);
  if (!role) {
    return next(new AppError("Role not found", 404));
  }

  const existrole = role.permissions.includes(permission._id);
  if (!existrole) {
    return next(new AppError("permission already exist", 404));
  }

  //update the role
  const newRole = await Role.findByIdAndUpdate(
    req.params.roleId,
    {
      $pull: { permissions: permission._id },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      role: newRole,
    },
  });
});

/*
 * @desc     Get One Role
 * @route    GET /api/roles/:id
 * @access   private admin
 */
const getOneRole = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id).populate({
    path: "permissions",
    select: "name",
  });

  if (!role) {
    return next(new AppError("Role is not found", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      role,
    },
  });
});

module.exports = {
  createRole,
  getAllroles,
  addRolePermission,
  removeRolePermission,
  ACLMiddleware,
  getOneRole,
  updateRoleDescription,
};
