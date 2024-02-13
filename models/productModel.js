const mongoose = require("mongoose");
const validator = require("validator");

// Product schema definition
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "A product must have a name"],
      trim: true,
      maxlength: [40, "Product name can't be longer than 40 characters"],
      minlength: [3, "Product name can't be shorter than 3 characters"],
    },

    cost: {
      type: Number,
      required: [true, "A product must have a cost"],
    },

    amountAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    // User field (reference to User model)
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      active: false,
    },
  },
  {
    // Virtual properties to include when converting to JSON/Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate user field when querying for products
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
