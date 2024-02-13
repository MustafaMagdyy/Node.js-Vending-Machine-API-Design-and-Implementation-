const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

// Function to sign a JWT token with the provided user ID
const signToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE,
  });
};

// Function to create and send a JWT token to the client
const createSendToken = function (user, statusCode, res) {
  const token = signToken(user._id);
  // ***This cookie part in case of production not dev**
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // ***ends here***
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Controller for user signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});

// Controller for user login
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("username or password is missing!", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid username or password", 401));
  }

  createSendToken(user, 200, res);
});

// Middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in, please login", 401));
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new AppError("This user no longer exists!", 401));
  }

  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "User recently changed their password, please try again",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// Middleware to restrict access based on user roles
exports.restriceTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have the permission to perform this action",
          403
        )
      );
    }
    next();
  };
};

// Controller for updating user password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Invalid password!", 401));
  }

  user.password = req.body.password;

  await user.save();
  createSendToken(user, 200, res);
});
