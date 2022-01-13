const express = require("express");
const morgan = require("morgan");
const path = require("path");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

//ROUTERS
const userRouter = require("./routers/userRoutes");
const productRouter = require("./routers/productRoutes");
const categoryRouter = require("./routers/categoryRoutes");
const orderRoutes = require("./routers/orderRoutes");
const cartRouter = require("./routers/cartRoutes");
const rolrRouter = require("./routers/roleRoutes");
const permissionRouter = require("./routers/permissionRoutes");
const brandRouters = require("./routers/brandRoutes");

//Models
// const Role = require( './models/RoleModel' );
const app = express();

//Global middleware to get information about the request
// if ( process.env.NODE_ENV === 'development' ) {
// }
app.use(morgan("dev"));

//Express Middleware to user req.body in post,update,delete requests
app.use(express.json());
app.use(express.urlencoded());
app.disable("etag");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.methods === "OPTIONS") {
    res.header("Access-Control-Allow-Methos", "POST, PUT, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/roles", rolrRouter);
app.use("/api/permissions", permissionRouter);
app.use("/api/brands", brandRouters);

app.use("/api/config/paypal/clientid", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

__dirname = path.resolve();
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.use(express.static(path.join(__dirname, "/dashboard-production/build")));

  app.get(/^\/auth/, (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "dashboard-production", "build", "index.html")
    )
  );

  app.get(/^\/dashboard/, (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "dashboard-production", "build", "index.html")
    )
  );
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

//404 Error
app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found: ", 400));
});

//Middleware for error handling
app.use(globalErrorHandler);

module.exports = app;
