const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const {
  authenticateToken,
  requireEmployee,
} = require("../middlewares/jwtAuth");
const validate = require("../middlewares/validate");
const employeeValidator = require("../validators/authValidator");

router.get(
  "/dashboard",
  authenticateToken,
  requireEmployee,
  employeeController.getDashboard
);
router.get(
  "/orders",
  authenticateToken,
  requireEmployee,
  employeeController.getOrders
);
router.put(
  "/profile",
  authenticateToken,
  requireEmployee,
  validate(employeeValidator.employeeRegister),
  employeeController.updateProfile
);
router.get(
  "/earnings",
  authenticateToken,
  requireEmployee,
  employeeController.getEarnings
);

module.exports = router;
