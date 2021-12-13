const express = require("express");
const router = express.Router();

const {
  resizeImage,
  createCategory,
  getAllCategory,
  getMainCategories,
  getAllCategorySubs,
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  getOneSubCategory,
  updateCategory,
  getOneaCategory,
} = require("../controllers/categoryController");
const authController = require("../controllers/authController");
const { ACLMiddleware } = require("../controllers/roleController");
const multerUpload = require("../utils/multerUpload");

router
  .route("/")
  .post(
    authController.protect,
    ACLMiddleware("createCategory"),
    multerUpload.uploadImageToMemory("photo"),
    resizeImage("category", "categories"),
    createCategory
  )
  .get(getAllCategory);

router.get("/main", getMainCategories);

router.get("/subCategories/:catId", getAllCategorySubs, getAllSubCategory);

router
  .route("/sub")
  .post(
    authController.protect,
    ACLMiddleware("createSubCategory"),
    multerUpload.uploadImageToMemory("photo"),
    resizeImage("subCategory", "subcategories"),
    createSubCategory
  )
  .get(getAllSubCategory);

router
  .route("/sub/:id")
  .patch(
    authController.protect,
    ACLMiddleware("updateSubCategory"),
    multerUpload.uploadImageToMemory("photo"),
    resizeImage("subCategory", "subcategories"),
    updateSubCategory
  )
  .get(authController.protect, getOneSubCategory);

router
  .route("/:id")
  .patch(
    authController.protect,
    ACLMiddleware("updateCategory"),
    multerUpload.uploadImageToMemory("photo"),
    resizeImage("category", "categories"),
    updateCategory
  )
  .get(getOneaCategory);

module.exports = router;
