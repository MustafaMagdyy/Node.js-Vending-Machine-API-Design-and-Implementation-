const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");

const router = express.Router();

// Route to get all products
router.get("/", productController.getAllProducts);

// Middleware for protecting routes and restricting access to sellers only
router.use(
  authController.protect,
  authController.restriceTo("seller"),
  productController.setUserIds
);

// Route to create a new product
router.post("/create-product", productController.createProduct);

// Routes to delete and update a product
router
  .route("/:id")
  .delete(productController.sellerCheck, productController.deleteProduct)
  .patch(productController.sellerCheck, productController.updateProduct);

module.exports = router;
