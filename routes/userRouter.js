const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// Route to get all users
router.get("/", userController.getAllUsers);

// Routes for signup and login
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Middleware to protect routes below this point
router.use(authController.protect);

// Route to update user password
router.patch("/update-my-password", authController.updatePassword);

// Route to get current user profile
router.get("/me", userController.getMe, userController.getUser);

// Route to delete user account
router.delete("/delete-me", userController.deleteMe);

// Route to update user profile
router.patch("/update-me", userController.updateMe);

// Route to deposit funds into user account
router.patch(
  "/deposit",
  authController.restriceTo("buyer"),
  userController.deposit
);

// Route to buy a product
router.patch("/buy", authController.restriceTo("buyer"), userController.buy);

// Route to reset user deposit
router.patch(
  "/reset",
  authController.restriceTo("buyer"),
  userController.reset
);

module.exports = router;
