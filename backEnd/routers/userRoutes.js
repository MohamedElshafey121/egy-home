const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { ACLMiddleware } = require("../controllers/roleController");
const userController = require("../controllers/userController");

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetePassword);
router.post(
  "/changePassword",
  authController.protect,
  userController.changePassword
);
router
  .route("/profile")
  .get(
    authController.protect,
    userController.getUserProfile,
    userController.getUser
  )
  .patch(authController.protect, userController.updateUserProfile);

router.patch(
  "/:userId/roles",
  authController.protect,
  userController.changeUserRole
);

router.patch(
  "/:userId/categories",
  authController.protect,
  userController.assignCategoryToUser
);

router.route("/:id").get(authController.protect, userController.getUser);

router.get(
  "/",
  authController.protect,
  ACLMiddleware("getAllUsers"),
  authController.getAllUsers
);
router.patch("/address", authController.protect, userController.addUserAddress);
router
  .route("/address/:id")
  .patch(authController.protect, userController.updateUserAddress)
  .delete(authController.protect, userController.deleteUSerAddress)
  .get(authController.protect, userController.getAddress);

module.exports = router;
