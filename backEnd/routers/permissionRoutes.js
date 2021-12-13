const express = require("express");
const router = express.Router();

//CONTROLLERS
const authController = require("../controllers/authController");
const { ACLMiddleware } = require("../controllers/roleController");

const {
  createPermission,
  getAllPermissions,
} = require("../controllers/permissionController");

router
  .route("/")
  .post(
    authController.protect,
    ACLMiddleware("createPermission"),
    createPermission
  )
  .get(
    authController.protect,
    ACLMiddleware("getAllPermissions"),
    getAllPermissions
  );

module.exports = router;
