const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const {
  authenticateToken,
  requireCustomer,
} = require("../middlewares/jwtAuth");
const validate = require("../middlewares/validate");
const customerValidator = require("../validators/customerValidator");

router.get(
  "/profile",
  authenticateToken,
  requireCustomer,
  customerController.getProfile
);
router.get(
  "/dashboard",
  authenticateToken,
  requireCustomer,
  customerController.getDashboard
);
router.put(
  "/profile",
  authenticateToken,
  requireCustomer,
  validate(customerValidator.register),
  customerController.updateProfile
);
router.post(
  "/wallet/add",
  authenticateToken,
  requireCustomer,
  validate(customerValidator.addMoney),
  customerController.addMoney
);
router.get(
  "/wallet/balance",
  authenticateToken,
  requireCustomer,
  customerController.getBalance
);
router.get(
  "/transactions",
  authenticateToken,
  requireCustomer,
  customerController.getTransactions
);
router.get(
  "/transactions/:limit",
  authenticateToken,
  requireCustomer,
  customerController.getTransactionsLimited
);
router.get(
  "/orders",
  authenticateToken,
  requireCustomer,
  customerController.getOrders
);

module.exports = router;
