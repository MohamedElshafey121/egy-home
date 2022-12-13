const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/categoryModel");
const fs = require("fs");

// writeFile();

dotenv.config({ path: "./backEnd/config.env" });

const app = require("./app.js");

// mongoose.set('bufferCommands', false);

const DB = process.env.DATABASE_PRODUCTION.replace(
  "<PASSWORD>",
  process.env.DATA_BASE_PASSWORD_PRODUCTION
);
const DB_LOCAL = process.env.LOCAL_DATABASE;

// mongoose
//   .connect("mongodb://localhost:27017/egyHome")
//   .then(() => {
//     console.log("DataBase Connected Successfully");
//   })
//   .catch((err) => {
//     console.warn("Error: ", err.message);
//   });
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DataBase connected successfully"))
  .catch((err) => {
    console.log("MNGOOSE ERROR: ", err);
  });

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// process.on( 'unhandledRejection', err => {
//     console.log( 'UNHANDLED REJECTION! 💥 Shutting down...' );
//     console.log(err)

//     console.log( err.name, err.message );
//     server.close( () => {
//         process.exit( 1 );
//     } );
// } );
