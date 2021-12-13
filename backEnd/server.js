const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/categoryModel");
const fs = require("fs");

// process.on('uncaughtException', err => {
//     console.log( 'UNCAUGHT EXCEPTION! 💥 Shutting down...' );
//     console.log(err)
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// async function loadCategory() {
//   let data;
//   const dataget = [];
//   const categories = await Category.find()
//     .sort("-createdAt")
//     .limit(10)
//     .select("_id");
//   data = categories.map(async (Cat, idx) => {
//     return await Category.findOne({ _id: Cat._id }).select("name -_id");
//     // const subs = await Category.findOne({ _id: Cat._id }).select("name -_id");
//     // dataget.push(subs);
//     // return subs;
//   });
//   return data;
// }

// // loadCategory();
// async function writeFile() {
//   const data = loadCategory().then((data) => console.log(data));
//   //   await data;
//   //   console.log("data ", data);
// }

// writeFile();

dotenv.config({ path: "./backEnd/config.env" });

const app = require("./app.js");

// mongoose.set('bufferCommands', false);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const DB_LOCAL = process.env.LOCAL_DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DataBase Connected Successfully");
  })
  .catch((err) => {
    console.warn("Error: ", err.message);
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
