const AppError = require("../utils/appError");
const config = require("../config");

const handleExpiredToken = (err) => {
  return new AppError("Token expired. Please log in again", 401);
};

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field \'${field}\'. Please choose another value.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.keys(err.errors).map((el) => err.errors[el].message);

  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleTokenError = (err) => {
  return new AppError("Invalid token", 401);
};

const handleInvalidJSON = (err) => {
  return new AppError("Invalid JSON body", 400);
};

const sendDevResponse = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdResponse = (err, res) => {
  // Trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (config.NODE_ENV === "development") {
    return sendDevResponse(err, res);
  }
  if (config.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    if (error.name === "TokenExpiredError") error = handleExpiredToken(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleTokenError(error);
    if (error.name === "SyntaxError") error = handleInvalidJSON(error);

    return sendProdResponse(error, res);
  }
};

module.exports = globalErrorController;
