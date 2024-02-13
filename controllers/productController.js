const { findById } = require("../models/userModel");
const Product = require("./../models/productModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Factory = require("./handlerFactory");

// Middleware to set user ID for product creation
exports.setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Middleware to check if the user is the seller of the product
exports.sellerCheck = catchAsync(async (req, res, next) => {
  const seller = await Product.findById(req.params.id);
  if (seller.user.id !== req.user.id) {
    return next(new AppError("You are not the owner of this product", 401));
  }
  next();
});

exports.createProduct = Factory.createOne(Product);

exports.getAllProducts = Factory.getAll(Product);

exports.deleteProduct = Factory.deleteOne(Product);

exports.updateProduct = Factory.updateOne(Product);
