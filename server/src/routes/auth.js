const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/jwtAuth");

// Customer Auth
router.post("/customers/register", authController.customerRegister);
router.post("/customers/login", authController.customerLogin);

// Employee Auth
router.post("/employees/register", authController.employeeRegister);
router.post("/employees/login", authController.employeeLogin);

// Logout
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
