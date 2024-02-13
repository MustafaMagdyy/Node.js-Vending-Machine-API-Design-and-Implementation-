const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message, err);
  process.exit(1);
});

// Setting up environment variables
dotenv.config({ path: "./config.env" });

const app = require("./app");

// Connecting to MongoDB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then((con) => {
    console.log("connected!");
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;

// Starting the server
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// Handling unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
