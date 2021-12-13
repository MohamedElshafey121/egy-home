const express = require("express");
const router = express.Router();

//CONTROLLERS
const authController = require("../controllers/authController");
const { ACLMiddleware } = require("../controllers/roleController");
const productController = require("../controllers/productController");
const AppError = require("../utils/appError");

// const acl = {
//     'admin': ['updateProduct'],
//     'user': ['updateProduct'],

// }

// function aclAuth ( permission ) {
//     return ( req, res, next )=> {
//         const role = req.user.role;
//         const perms = acl[role];
//         if ( !perms.includes( permission ) ) {
//             console.log('not allowed')
//             return next(new AppError(`You aren't allowed`,403))
//         }
//         console.log('allowed')
//     next();
// }
// }

router
  .route("/category/:id")
  .get(
    productController.getProductByCategory,
    productController.getAllProducts
  );
// router.route( '/sub/:id' )
// .get(
//     productController.getProductBySubCategory,
//     productController.getAllProducts
// );

router
  .route("/")
  .post(
    authController.protect,
    ACLMiddleware("createProduct"),
    productController.uploadProductImage,
    productController.resizeproductImages,
    productController.createProduct
  )
  .get(productController.getAllProducts);

router.get(
  "/top/:catId?",
  productController.getTopProducts,
  productController.getAllProducts
);
router.get(
  "/recent/:catId?",
  productController.getRecentProducts,
  productController.getAllProducts
);

router
  .route("/:id")
  .get(productController.GetProduct)
  .patch(
    authController.protect,
    ACLMiddleware("updateProduct"),
    productController.uploadProductImage,
    productController.resizeproductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    ACLMiddleware("deleteProduct"),
    productController.deleteProduct
  );
// .patch(
//     authController.protect,
//      productController.uploadProductImage,
//     productController.resizeproductImages,
//     productController.addImgae
// )
router.post(
  "/:id/reviews",
  authController.protect,
  productController.createProductReview
);

router.get("/:id/related", productController.getRelatedProducts);

router
  .route("/:id/specifications")
  .post(
    authController.protect,
    ACLMiddleware("addProductSpecification"),
    productController.uploadProductSpecImage,
    productController.resizeProductSpecImgae,
    productController.addProductSpecification
  );

router
  .route("/:id/specifications/:specId")
  .get(authController.protect, productController.getProductOneSpecifcation)
  .delete(
    authController.protect,
    ACLMiddleware("removeProductSpecification"),
    productController.removeProductSpecification
  )
  .patch(
    authController.protect,
    ACLMiddleware("updateProductSpecification"),
    productController.uploadProductSpecImage,
    productController.resizeProductSpecImgae,
    productController.updateProductSpecification
  );

module.exports = router;
