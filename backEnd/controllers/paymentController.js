const request = require("request");
const sha512 = require("js-sha512");

const Order = require("../models/orderModel");
const AppError = require("./../utils/appError");

//Helper methods
function generateSignature(reference, privateKey) {
  const formData = {
    country: "EG",
    reference,
  };

  // var privateKey = "OPAYPRV16498910034960.622946713954366";

  var hash = sha512.hmac.create(privateKey);
  hash.update(JSON.stringify(formData));
  hmacsignature = hash.hex();
  console.log(hmacsignature);

  return hmacsignature;
}

// function checkIfOperationNotFake(reference, privateKey) {
//   const formData = {
//     country: "EG",
//     reference,
//   };
//   const hmacsignature = generateSignature(reference, privateKey);
//   request(
//     {
//       url: "https://sandboxapi.opaycheckout.com/api/v1/international/cashier/status",
//       method: "POST",
//       headers: {
//         MerchantId: "281822041347906",
//         Authorization: "Bearer " + hmacsignature,
//       },
//       json: true,
//       body: formData,
//     },
//     function (error, response, body) {
//       console.log("body: ");
//       console.log(body);
//       return body;
//     }
//   );
// }

exports.checkOutpayment = async (req, res, next) => {
  // var publickey = "OPAYPUB16498910034960.6573147306965978";
  request(
    {
      url: "https://sandboxapi.opaycheckout.com/api/v1/international/cashier/create",
      method: "POST",

      headers: {
        Authorization: "Bearer OPAYPUB16498910034960.6573147306965978",
        MerchantId: "281822041347906",
      },
      json: true,
      body: req.body,
    },
    function (error, response, body) {
      res.status(200).json({
        message: "Success",
        data: body,
      });
    }
  );
};

/**
 *
 * @param {} req
 * @param {reference} is the order Id
 * @param {status} ['FAIL','SUCCESS]
 */
exports.checkOutRedirect = async (req, res, next) => {
  const {
    reference,
    amount,
    timestamp,
    updated_at,
    displayedFailure,
    status,
    transactionId,
  } = req.body.payload;

  const order = await Order.findById(reference);
  if (!order) {
    return next(new AppError("order Not found", 4040));
  }

  //1)Check status
  //1.1)if FAIL don't update order
  if (status === "FAIL") {
    order.paymentResult.id = transactionId;
    order.paymentResult.status = status;
    order.paymentResult.update_time = updated_at;
    order.paymentResult.fail_reason = displayedFailure;
    await order.save({ validateBeforeSave: false });

    return res.status(204).json({ status: "FAIL", message: displayedFailure });
  }

  //1.2)if SUCCESS
  //1.2.a) check operation is true, if true update the order, if not true throw error

  const privateKey = "OPAYPRV16498910034960.622946713954366";
  const hmacsignature = generateSignature(reference, privateKey);
  request(
    {
      url: "https://sandboxapi.opaycheckout.com/api/v1/international/cashier/status",
      method: "POST",
      headers: {
        MerchantId: "281822041347906",
        Authorization: "Bearer " + hmacsignature,
      },
      json: true,
      body: {
        country: "EG",
        reference,
      },
    },
    async function (error, response, body) {
      if (body.code === "00000") {
        order.paymentResult.id = transactionId;
        order.paymentResult.status = status;
        order.paymentResult.update_time = updated_at;
        order.isPaid = true;
        order.paidAt = timestamp;

        await order.save({ validateBeforeSave: false });
        return res.status(200).json({ message: "OK" });
      } else {
        return res.status(204).json({ status: "FAIL", message: body.message });
      }
    }
  );

  res.status(200).json({ message: "OK" });
};
