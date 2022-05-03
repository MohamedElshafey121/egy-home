const router = require("express").Router();
const passport = require("passport");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const createSendToken = require("./../utils/createSendToken");
const crypto = require("crypto");
const User = require("../models/userModel");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    // successRedirect: "http://localhost:3000/shop/catalog",
    failureRedirect: "http://localhost:3000/account/login",
  }),
  (req, res) => {
    res.redirect(req.user); //req.user has the redirection_url
  }
);

const loginUserWithAuthToken = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("req.params.token => ", req.params.token);

  const user = await User.findOne({
    socialAuthToken: hashToken,
  });

  //if user set the password
  if (!user) {
    return next(new AppError("This Token is not valid ", 400));
  }

  user.socialAuthToken = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

router.post("/login/success/:token", loginUserWithAuthToken);

module.exports = router;
