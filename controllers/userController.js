const { findById } = require("../models/productModel");
const User = require("./../models/userModel");
const Product = require("./../models/productModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Factory = require("./handlerFactory");

// Update user profile (excluding password)
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-my-password.",
        400
      )
    );
  }

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Respond with updated user data
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// Soft delete user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Middleware to set req.params.id to req.user.id
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Deposit funds to user account
exports.deposit = catchAsync(async (req, res, next) => {
  // Find the buyer user
  const buyer = await User.findById(req.user.id);
  // Check the deposited amount value
  if (
    req.body.deposit !== 5 &&
    req.body.deposit !== 10 &&
    req.body.deposit !== 20 &&
    req.body.deposit !== 50 &&
    req.body.deposit !== 100
  ) {
    return next(
      new AppError(
        "Deposited amount must be either 5,10,20,50 or 100 coin cent!",
        400
      )
    );
  }
  // Add deposited amount to user's balance
  buyer.deposit = buyer.deposit + req.body.deposit;
  // Save updated user document
  await buyer.save();

  // Respond with success status and updated user data
  res.status(200).json({
    status: "success",
    data: buyer,
  });
});

// Buy a product
exports.buy = catchAsync(async (req, res, next) => {
  // Find the product to buy
  const product = await Product.findById(req.body.productId);
  // Check if requested amount is available
  if (product.amountAvailable < req.body.amount) {
    return next(new AppError("This amount is not available right now ", 404));
  }
  // Calculate total cost
  const total = req.body.amount * product.cost;
  // Check if user has sufficient funds
  if (total > req.user.deposit) {
    return next(new AppError("Insufficient funds ", 400));
  }
  // Calculate change
  const Totalchange = req.user.deposit - total;
  const change = req.user.calcChange(Totalchange);
  let sum = 0;
  for (const key in change) {
    sum += parseInt(key);
  }
  const leftInDeposit = Totalchange - sum;
  // Update user deposit and product amount available
  req.user.deposit = leftInDeposit;
  product.amountAvailable = product.amountAvailable - req.body.amount;
  await product.save();

  // Respond with success status and transaction details
  res.status(200).json({
    status: "success",
    product: product.name,
    spent: total,
    change: change,
    leftInDeposit: leftInDeposit,
  });
});

// Reset user deposit
exports.reset = catchAsync(async (req, res, next) => {
  req.user.deposit = 0;
  await req.user.save();
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

exports.getAllUsers = Factory.getAll(User);

exports.getUser = Factory.getOne(User);
