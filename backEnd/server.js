const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/categoryModel");
const fs = require("fs");

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
//     console.log( 'UNHANDLED REJECTION! ðŸ’¥ Shutting down...' );
//     console.log(err)

//     console.log( err.name, err.message );
//     server.close( () => {
//         process.exit( 1 );
//     } );
// } );
