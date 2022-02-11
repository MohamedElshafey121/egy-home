const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  addNewSliderItem,
  uploadSliderImage,
  deleteSliderItem,
  editSliderItem,
  resizeSliderImgae,
  getAllSliderItems,
  getOneSlider,
} = require("../controllers/sliderController");

router
  .route("/")
  .post(
    authController.protect,
    uploadSliderImage,
    resizeSliderImgae,
    addNewSliderItem
  )
  .get(getAllSliderItems);

router
  .route("/:id")
  .delete(authController.protect, deleteSliderItem)
  .patch(
    authController.protect,
    uploadSliderImage,
    resizeSliderImgae,
    editSliderItem
  )
  .get(authController.protect, getOneSlider);

module.exports = router;
