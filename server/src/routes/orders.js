const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticateToken,
  requireCustomer,
  requireEmployee,
} = require("../middlewares/jwtAuth");

const validate = require("../middlewares/validate");
const orderValidator = require("../validators/orderValidator");

router.post(
  "/",
  authenticateToken,
  requireCustomer,
  validate(orderValidator.create),
  orderController.placeOrder
);
router.get(
  "/pending",
  authenticateToken,
  requireEmployee,
  orderController.getPending
);
router.put(
  "/:id/manage",
  authenticateToken,
  requireEmployee,
  orderController.manageOrder
);
router.get(":id", authenticateToken, orderController.getOne);

module.exports = router;
