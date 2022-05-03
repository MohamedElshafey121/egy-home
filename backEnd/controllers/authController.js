const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const passport = require("passport");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const createSendToken = require("./../utils/createSendToken");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const APIFeatures = require("./../utils/apiFeatures");
const Email = require("../utils/prodEmail");

//Sign Up handler
exports.signUp = catchAsync(async (req, res, next) => {
  // 1)Create User According to Incoming Data
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  if (!user) {
    return next(new AppError("Error Creating User", 400));
  }

  const cart = await Cart.create({
    cartItems: [],
    user: user._id,
  });

  if (!cart) {
    return next(new AppError("Error Creating User Cart cannot created", 400));
  }

  await user.save();

  const newUser = await User.findById(user._id).select("name email ");

  // 2)encrypt password ==> it will happens in 'pre save hook'
  // 3)create a jwt and send it to the user
  createSendToken(newUser, 201, res);
});

//Login Handler
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email is exist
  if (!email || !password) {
    return next(new AppError("Please enter email and password", 400));
  }

  //2) check if email and password correct
  const user = await User.findOne({ email }).select(
    "+password name email registerationType"
  );

  if (user.registerationType === "google") {
    return next(new AppError("user name or password is incorrect", 400));
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Email or password is not valid ", 400));
  }

  // 3)create token in case email & password are correct
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in! please log in to get access", 401)
    );
  }
  // 2) Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new AppError("User belongs to that token is not exist", 401));
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError("User recently changed password please log in again", 401)
    );
  }

  req.user = currentUser;
  next();
});

//Check roles and conditions
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to get access to that resources", 403)
      );
    }
    next();
  };
};

// sendEmail();

// exports.forgotPassword = catchAsync( async ( req, res, next ) => {
//     console.log( "Forget pass Start" );
//     // 1)get the user according to the email
//     const user = await User.findOne( { email: req.body.email } );
//     if ( !user ) {
//         return next(
//             new AppError( 'No User with this email exist signup instead!', 500 )
//         );
//     }

//     // 2)create resete token
//     const resetToken = user.createPasswordResetToken();
//     await user.save( { validateBeforeSave: false } );

//     await sendEmail();

//     // 3)send reset token via Email
//     // try {
//     //     await sendEmail();
//     //     console.log( "Email send successfully" );

//     // } catch(err) {
//     //     user.passwordResetToken = undefined;
//     //     user.passwordResetExpires = undefined;
//     //     await user.save( { validateBeforeSave: false } );
//     //     console.log( 'Error: ', err );
//     //       return next(
//     //         new AppError( 'No User with this email exist signup instead!', 500 )
//     //     );
//     // }

//     res.status( 200 ).json( {
//         success: true,
//         resetToken
//     })

// } );

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  // const resetURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/auth/password/reset/${resetToken}`;

  const resetURL = `${req.protocol}://localhost:3000/account/reset/${resetToken}`;
  const message = `Forgot your password ?\n Submit  your new password to:\n ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await new Email(user).send("Egy Home Forget password", message);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetePassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if user set the password
  if (!user) {
    return next(new AppError("This Token is not valid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // await user.save();
  await user.save();

  createSendToken(user, 200, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const countdocs = new APIFeatures().countDocuments(User, req.query);
  const count = await countdocs;
  const users = await features.query;

  const page = req.query.page;
  res.status(200).json({
    status: "success",
    data: {
      users,
      page,
      count,
      pages: Math.ceil(count / limit),
    },
  });
});
