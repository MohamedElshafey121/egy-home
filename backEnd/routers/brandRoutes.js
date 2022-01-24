const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const multerUpload = require("../utils/multerUpload");
const { ACLMiddleware } = require("../controllers/roleController");

const {
  createNewBrand,
  getAllBrands,
  resizeImgae,
  getOneBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

router
  .route("/")
  .post(
    authController.protect,
    ACLMiddleware("createNewBrand"),
    multerUpload.uploadImageToMemory("photo"),
    resizeImgae,
    createNewBrand
  )
  .get(getAllBrands);

router
  .route("/:id")
  .get(getOneBrand)
  .patch(
    authController.protect,
    multerUpload.uploadImageToMemory("photo"),
    resizeImgae,
    ACLMiddleware("updateBrand"),
    updateBrand
  )
  .delete(authController.protect, ACLMiddleware("deleteBrand"), deleteBrand);

module.exports = router;
