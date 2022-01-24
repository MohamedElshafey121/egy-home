const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  addNewSliderItem,
  uploadSliderImage,
  deleteSliderItem,
} = require("../controllers/sliderController");

router.post("/", authController.protect, uploadSliderImage, addNewSliderItem);
router.delete("/:id", authController.protect, deleteSliderItem);

module.exports = router;
