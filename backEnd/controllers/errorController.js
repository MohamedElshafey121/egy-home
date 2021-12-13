const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  // const value = err.message.match(/(["'])(\\?.)*?\g/)[2];

  // console.log( 'cast Error', err.path, err.value )
  // console.log( 'cast Error', err.message )
  // const message = `Invalid ${err.path}: ${err.value}.`;
  // return new AppError(message, 400);
  // console.log( 'Cast error => ', err );

  const messageObj = {};
  const key = err.message.match(/(["'])(\\?.)*?\1/g)[2];
  const msg = err.message;
  messageObj[key.split('"').join("")] = msg;
  return new AppError(JSON.stringify(messageObj), 400);
};

// const handleCustomError = err => {
//   const key = err.message.split( ' ' )[0];
//   return new AppError(JSON.stringify({[err.message.split( ' ' )[0].toLowerCase()]:err.message}),404)
// }

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue)[0];
  // const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  // console.log("value => ",value);
  // console.log( 'Database Duplicate field error => ', err );
  const message = { [key]: `${key} is already exist` };
  return new AppError(JSON.stringify(message), 400);
};
const handleValidationErrorDB = (err) => {
  // const errors = Object.values(err.errors).map(el => el.message);
  // console.log( 'Database Validation error => ', err );
  // const message = `Invalid input data. ${errors.join('. ')}`;
  const messageObj = {};
  let key = Object.keys(err.errors)[0];

  //Nested Schema Key
  if (key.split(".").length > 1) {
    // console.log( 'Nested Schema Key Key' )
    key = key.split(".")[Number(key.split(".").length) - 1];
  }

  const msg = err.errors[Object.keys(err.errors)[0]].message;
  messageObj[key] = msg;

  const message = err.errors[Object.keys(err.errors)[0]];
  return new AppError(JSON.stringify(messageObj), 400);
  // return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // console.error(' ERROR 💥', err);

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    // console.error('OPERATIONAL ERROR 💥', err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

/**
 * @desc Global error handler middleware
 */
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // console.error('err Name ===> ', err.name);
    // console.error('err type ===> ', typeof(err));
    // console.error('err dest ===> ', {...err});

    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;
    // error.path = err.path;
    // error.value = err.value;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    // if (error.name === 'Error') error = handleCustomError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
