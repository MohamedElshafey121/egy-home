const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

router
  .route("/")
  .post(authController.protect, cartController.createCart)
  .get(authController.protect, cartController.getCart);

router
  .route("/items")
  .post(authController.protect, cartController.addCartItem)
  .get(authController.protect, cartController.getcartItem)
  .delete(authController.protect, cartController.emptyCart);

router
  .route("/items/:id")
  .delete(authController.protect, cartController.deleteCartItem)
  .patch(authController.protect, cartController.updateCartItem);

module.exports = router;
