const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

router
  .route("/")
  .post(authController.protect, orderController.addOrderItems)
  .get(authController.protect, orderController.getOrdersList);

router
  .route("/recent")
  .get(
    authController.protect,
    orderController.getRecentOrder,
    orderController.getOrdersList
  );

router
  .route("/me")
  .get(
    authController.protect,
    orderController.getMyOrders,
    orderController.getOrdersList
  );

router
  .route("/users/:userId")
  .get(
    authController.protect,
    orderController.getUserOrderList,
    orderController.getOrdersList
  );

router
  .route("/:id")
  .get(authController.protect, orderController.getOrder)
  .patch(authController.protect, orderController.updateOrder);

router
  .route("/admin/:id")
  .patch(authController.protect, orderController.updateOrderStatus);

router.get(
  "/track/:id",
  authController.protect,
  orderController.checkTrackOrder
);

module.exports = router;
