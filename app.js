const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express(); // Creating express application
app.use(express.json()); // Parsing JSON bodies
app.use(helmet()); // Setting security headers

// Logging requests in development environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting middleware
const limiter = rateLimit({
  max: 100, // Max requests per IP
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/vending-machine", limiter); // Applying limiter middleware

// Parsing JSON bodies with a limit of 10kb
app.use(express.json({ limit: "10kb" }));

// Sanitizing data to prevent MongoDB query injection
app.use(mongoSanitize());

// Preventing XSS attacks
app.use(xss());

// Preventing HTTP Parameter Pollution
app.use(hpp());

// Routing
app.use("/vending-machine/api/version1/users", userRouter);
app.use("/vending-machine/api/version1/products", productRouter);

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
