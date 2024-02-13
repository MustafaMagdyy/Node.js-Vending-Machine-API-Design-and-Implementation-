const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A user must have a name"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "A user must have a password."],
      minlength: 6,
      select: false, // Excluding password field from query results
    },

    deposit: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      required: [true, "Please choose your role : buyer / seller"],
    },
  },
  {
    // Virtual properties to include when converting to JSON/Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Method to add deposit amount to user's balance
userSchema.methods.sumDeposit = async function (currentBalance, depositAmount) {
  this.deposit = currentBalance + depositAmount;
  next();
};

// Middleware to encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); // Hashing password with bcrypt
  next();
});

// Method to calculate change for a given amount
userSchema.methods.calcChange = function (change) {
  const coins = [100, 50, 20, 10, 5];
  const changeDict = {};
  for (const coin of coins) {
    const numCoins = Math.floor(change / coin);
    if (numCoins > 0) {
      changeDict[coin] = numCoins;
      change -= numCoins * coin;
    }
  }
  return changeDict;
};

// Method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if user changed password after JWT issue time
userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < changeTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
