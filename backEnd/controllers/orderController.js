const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Factory = require("./handlerFactory");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");

/**
 * @desc   CREATE NEW ORDER
 * @route  POST /api/orders
 * @access Private
 */
exports.addOrderItems = catchAsync(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    phone,
    paymentMethod,
    paymentResult,
    shippingPrice,
    totalPrice,
    itemsPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new AppError("There is No order items", 400));
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    user: req.user._id,
    phone,
    paymentMethod,
    paymentResult,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  const newOrder = await order.save();
  res.status(201).json({
    status: "success",
    data: {
      order: newOrder,
    },
  });
});

/**
 * @desc   GET ORDERS LIST
 * @route  get /api/orders
 * @access Private
 */
exports.getOrdersList = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;

  // console.log( req.query );
  const ordersQuery = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const orders = await ordersQuery.query;
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

/**
 * @desc   GET ORDER BY ID
 * @route  GET /api/orders/:id
 * @access Private
 */
// exports.getOrder = Factory.getOne( Order );
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new AppError("Order in not found", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      order,
    },
  });
});

/**
 * @desc   GET MY ORDERS
 * @route  GET /api/orders/me
 * @access Private
 */
exports.getMyOrders = (req, res, next) => {
  req.query.user = req.user._id;
  next();
};

/**
 * @desc   GET User ORDERS list
 * @route  GET /api/orders/users/:userId
 * @access Private
 */
exports.getUserOrderList = (req, res, next) => {
  req.query.user = req.params.userId;
  next();
};

/**
 * @desc   Update order Status (canceled,onHold,delayed)
 * @route  PATCH /api/orders/:id
 * @access Private
 */
exports.updateOrder = Factory.updateOne(Order);
