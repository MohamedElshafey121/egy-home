const request = require("request");

const checkoutFormData = {
  amount: {
    currency: "EGP",
    total: 100000,
  },
  callbackUrl: "http://localhost:5000/payment/redirectPayment",
  cancelUrl: "127.0.0.1:3000/your-cacel-url",
  country: "EG",
  expireAt: 300,
  payMethod: "BankCard",
  productList: [
    {
      description: "productList description",
      imageUrl: "https://imageUrl.com",
      name: "name",
      price: 100,
      productId: "610168b22639f50adc658c00",
      quantity: 2,
    },
  ],
  reference: "61c4ec1ad55900c700e28",
  returnUrl: "127.0.0.1:3000/your-return-url",
  userInfo: {
    userEmail: "mgmohamed11@gmail.com",
    userId: "60b303ce377fa253d83942b8",
    userMobile: "01010981072",
    userName: "mohamed Gamal",
  },
};

exports.checkOutpayment = async (req, res, next) => {
  var publickey = "OPAYPUB16498910034960.6573147306965978";
  // return res.redirect("http://www.facebook.com");
  // console.log(req.body);

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
      // console.log("body: ");
      // console.log(body);
      // body.code = 00000; //Success else error
      // body.message
      // if (body.data && body.data.cashierUrl) {
      //   return res.redirect(body.data.cashierUrl);
      // }

      res.status(200).json({
        message: "Success",
        data: body,
      });
    }
  );
};

exports.checkOutRedirect = async (req, res, next) => {
  console.log("redirectPayment");
  res.status(200).json({ message: "OK" });
};
