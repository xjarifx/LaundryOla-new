const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/jwtAuth");
const validate = require("../middlewares/validate");
const {
  customerRegister: customerRegisterSchema,
  customerLogin: customerLoginSchema,
  employeeRegister: employeeRegisterSchema,
  employeeLogin: employeeLoginSchema,
} = require("../validators/authValidator");

// Customer Auth with validation
router.post(
  "/customers/register",
  validate(customerRegisterSchema),
  authController.customerRegister
);
router.post(
  "/customers/login",
  validate(customerLoginSchema),
  authController.customerLogin
);

// Employee Auth with validation
router.post(
  "/employees/register",
  validate(employeeRegisterSchema),
  authController.employeeRegister
);
router.post(
  "/employees/login",
  validate(employeeLoginSchema),
  authController.employeeLogin
);

// Logout
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
