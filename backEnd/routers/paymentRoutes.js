const router = require("express").Router();
const paymentController = require("../controllers/paymentController");

router.post("/checkout", paymentController.checkOutpayment);
router.get("/redirectPayment", paymentController.checkOutRedirect);

module.exports = router;
