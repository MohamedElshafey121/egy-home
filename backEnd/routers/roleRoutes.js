const express = require("express");
const router = express.Router();

//CONTROLLERS
const authController = require("../controllers/authController");
const {
  createRole,
  getAllroles,
  ACLMiddleware,
  addRolePermission,
  removeRolePermission,
  getOneRole,
} = require("../controllers/roleController");

router
  .route("/")
  .post(authController.protect, ACLMiddleware("createNewRole"), createRole)
  .get(authController.protect, ACLMiddleware("getAllRoles"), getAllroles);

router
  .route("/:roleId/permissions/:permissionId")
  .delete(
    authController.protect,
    ACLMiddleware("removeRolePermission"),
    removeRolePermission
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    ACLMiddleware("addRolePermission"),
    addRolePermission
  )
  .get(authController.protect, ACLMiddleware("getOneRole"), getOneRole);

module.exports = router;
