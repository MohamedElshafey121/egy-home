const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Factory = require("./handlerFactory");

const Order = require("../models/orderModel");
const Email = require("../utils/prodEmail");

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

  if (!newOrder) {
    throw new AppError("Error Occured while creating order", 401);
  }

  let emailSent = false;

  //send email to the customer
  if (newOrder) {
    try {
      const message = `تم إستلام طلب رقم:\n ${newOrder._id}.\nوجارى العمل عليه`;
      await new Email(req.user).send(" طلب جديد من إيجى هوم", message);
      emailSent = true;
    } catch (err) {
      emailSent = false;
    }
  }

  //send email to admin
  try {
    const message = `لديك طلب جديد برقم:\n ${newOrder._id}.\n اضغط على الرابط لمتلبعة الطلب \n http://egy-home.com/dashboard/orders/${newOrder._id}`;
    await new Email({ email: "mero.aa555@gmail.com" }).send(
      " طلب جديد من إيجى هوم",
      message
    );
    emailSent = true;
  } catch (err) {
    emailSent = false;
  }

  res.status(201).json({
    status: "success",
    data: {
      order: newOrder,
      emailSent,
    },
  });
});

exports.getRecentOrder = (req, res, next) => {
  req.query.limit = 6;
  req.query.sort = "-createdAt";
  next();
};
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
 * @desc   Update order all or  Status (canceled,onHold,delayed)
 * @route  PATCH /api/orders/:id
 * @access Private
 */
exports.updateOrder = Factory.updateOne(Order);

/**
 * @desc   Update order Status (canceled,onHold,delayed)
 * @route  PATCH /api/orders/admin/:id
 * @access Private
 */
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status: newStatus, adminNotes } = req.body;
  // let sendEmailError = "";
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    select: "email",
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  //check if we can update status
  if (
    order.status === "canceled" ||
    order.status === "completed" ||
    order.status === "refused"
  ) {
    return next(new AppError("Order cannot be updated any more", 401));
  }

  //when complete mean received then it's paid
  if (newStatus === "completed") {
    if (order.isPaid === false) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
    }
  }

  let emailSent = false;
  //order onhold/accepted
  if (newStatus === "onhold") {
    try {
      const message = `تم تأكيد طلب رقم:\n ${order._id}.\n وهو الان فى مرحلة الشحن`;
      await new Email(order.user).send("  إيجى هوم", message);
      emailSent = true;
    } catch (err) {
      emailSent = false;
    }
  }

  //order refused
  if (newStatus === "refused") {
    try {
      const message = `تم رفض طلبكم رقم :\n ${newOrder._id}.\n من إيجى هوم للاسبا التاليه \n ${adminNotes}`;
      await new Email(order.user).send(" إيجى هوم", message);
      emailSent = true;
    } catch (err) {
      emailSent = false;
    }
  }

  //update status
  order.status = newStatus;

  if (adminNotes) {
    order.adminNotes = adminNotes;
  }
  if (!order.isReviewed) {
    order.isReviewed = true;
  }
  await order.save({ validateBeforeSave: true });

  res.status(200).json({ status: "Success" });
});

/**
 * @desc   Update order Status (canceled,onHold,delayed)
 * @route  get /api/orders/track/:id
 * @access Private
 */
exports.checkTrackOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  console.log("user Order ".toString().trim(), order.user._id);
  console.log("req.user._id ", req.user._id);

  if (order.user._id.toString().trim() !== req.user._id.toString().trim()) {
    return next(new AppError("You are not allowed to view that order", 403));
  }

  res.status(200).json({ status: "Success" });
});
