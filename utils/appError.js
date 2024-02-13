// Custom error class extending the built-in Error class
class AppError extends Error {
  constructor(message, statusCode) {
    // Call the Error class constructor with the provided message
    super(message);
    this.statusCode = statusCode;

    // Determine the status based on the statusCode
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";

    // Set the isOperational property to true to indicate that this error is operational
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
